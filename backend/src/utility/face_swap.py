"""
InsightFace InSwapper Face Swap
================================

High-quality face swap using:
- InsightFace (buffalo_l) for detection + embeddings
- InSwapper 128 ONNX model for identity transfer
"""

import os
import sys
import cv2
import argparse
import insightface
from insightface.app import FaceAnalysis
from insightface.model_zoo import get_model


class FaceSwapPipeline:
    def __init__(self, use_gpu=True, models_dir=None):
        print("===========================================")
        print("  InsightFace InSwapper - Initializing")
        print("===========================================")

        self.ctx_id = 0 if use_gpu else -1
        
        if models_dir:
            self.base_dir = models_dir
        else:
            # Check C:\Users\akash.k\Backend by default as a global cache
            global_cache_dir = "C:\\Users\\akash.k\\Backend"
            if os.path.exists(global_cache_dir):
                self.base_dir = global_cache_dir
            else:
                self.base_dir = os.path.dirname(os.path.abspath(__file__))

        # Validate critical model files before loading
        self._validate_model(os.path.join(self.base_dir, 'models', 'buffalo_l', '1k3d68.onnx'), 130)
        self._validate_model(os.path.join(self.base_dir, 'models', 'buffalo_l', 'w600k_r50.onnx'), 150)
        
        # Load detection + recognition model
        # REDUCE MEMORY USAGE: det_size=(320, 320)
        self.app = FaceAnalysis(name='buffalo_l', root=self.base_dir)
        self.app.prepare(ctx_id=self.ctx_id, det_size=(320, 320))
        
        import gc
        gc.collect()

        print("Detection Models loaded successfully.\n")

    def _validate_model(self, path, min_size_mb):
        if not os.path.exists(path):
            print(f"[Error] Missing model: {path}")
            sys.exit(1)
        
        size_mb = os.path.getsize(path) / (1024 * 1024)
        if size_mb < min_size_mb:
            print(f"[Error] Corrupt model: {path} (Size: {size_mb:.2f} MB, Expected: >{min_size_mb} MB)")
            sys.exit(1)
        print(f"[OK] Verified model: {os.path.basename(path)} ({size_mb:.2f} MB)")

    def load_swapper(self):
        print("Loading InSwapper model (Lazy Load)...")
        # Load InSwapper model
        model_path = os.path.join(self.base_dir, 'models', 'inswapper_128.onnx')
        
        # Check if model exists in models/ dir, else check root
        if not os.path.exists(model_path):
            root_model_path = os.path.join(self.base_dir, 'inswapper_128.onnx')
            if os.path.exists(root_model_path):
                print(f"Model found in root: {root_model_path}")
                model_path = root_model_path
            else:
                print(f"⚠️ Model not found in {model_path} or {root_model_path}")
        
        # Validate Inswapper size
        self._validate_model(model_path, 500)

        # Explicitly define providers based on initialization flag
        providers = ['CUDAExecutionProvider', 'CPUExecutionProvider'] if self.ctx_id == 0 else ['CPUExecutionProvider']

        self.swapper = get_model(
            model_path,
            download=False,
            download_zip=False,
            providers=providers
        )
        print(f"InSwapper loaded. (Provider: {providers[0]})")

    def swap(self, source_path, target_path, output_path):
        print("Reading images...")

        src_img = cv2.imread(source_path)
        tgt_img = cv2.imread(target_path)

        if src_img is None:
            print("Cannot load source image.")
            return False

        if tgt_img is None:
            print("Cannot load target image.")
            return False

        print("Detecting source face...")
        src_faces = self.app.get(src_img)

        if len(src_faces) == 0:
            print("No face detected in source image.")
            return False

        # Use first source face
        src_face = src_faces[0]

        # Extract and print gender detection details safely (1 = Male, 0 = Female in InsightFace)
        gender_val = getattr(src_face, 'gender', None)
        detected_gender = "UNKNOWN"
        if gender_val is not None:
            detected_gender = "MALE" if gender_val == 1 else "FEMALE"
            print(f"[GENDER_DETECTED] {detected_gender}")
        else:
            print("[GENDER_DETECTED] UNKNOWN")

        # Auto-switch target template to match detected gender
        target_filename = os.path.basename(target_path).lower()
        snack_type = None
        if 'cheesy' in target_filename:
            snack_type = 'cheesy'
        elif 'sweet' in target_filename or 'lovable' in target_filename:
            snack_type = 'lovable'
        elif 'sour' in target_filename or 'sassy' in target_filename:
            snack_type = 'sassy'
        elif 'creamy' in target_filename or 'smooth' in target_filename:
            snack_type = 'smooth'
        elif 'spicy' in target_filename:
            snack_type = 'spicy'

        if snack_type and detected_gender != "UNKNOWN":
            MALE_TEMPLATES = {
                'cheesy': 'NEWCHEESY-(1).jpg.jpeg',
                'lovable': 'malelovablesnack.png',
                'sassy': 'malesassysnack.png',
                'smooth': 'malesmoothsnack.png',
                'spicy': 'NEWSPICY1-(1).jpg.jpeg'
            }
            FEMALE_TEMPLATES = {
                'cheesy': 'femalecheesysnack.png',
                'lovable': 'NEWSWEET1.jpg.jpeg',
                'sassy': 'NEWSOUR-CREAM.jpg.jpeg',
                'smooth': 'NEWCREAMY-(1).jpg.jpeg',
                'spicy': 'femalespicysnack.png'
            }
            
            new_tpl = MALE_TEMPLATES[snack_type] if detected_gender == "MALE" else FEMALE_TEMPLATES[snack_type]
            templates_dir = os.path.dirname(target_path)
            new_target_path = os.path.join(templates_dir, new_tpl)
            
            if os.path.exists(new_target_path):
                print(f"[TEMPLATE_AUTO_SWITCH] Switched target template to: {new_tpl}")
                target_path = new_target_path
                tgt_img = cv2.imread(target_path)
                if tgt_img is None:
                    print(f"Cannot load switched target image: {target_path}")
                    return False
            else:
                print(f"⚠️ Switched template file does not exist locally: {new_target_path}")

        print("Detecting target faces...")
        tgt_faces = self.app.get(tgt_img)

        if len(tgt_faces) == 0:
            print("No face detected in target image.")
            return False

        print(f"Source faces detected: {len(src_faces)}")
        print(f"Target faces detected: {len(tgt_faces)}")

        # CRITICAL MEMORY OPTIMIZATION:
        # Unload detection model to free RAM for Swapper
        print("Unloading detection models to free memory...")
        del self.app
        import gc
        gc.collect()

        # Load Swapper NOW
        self.load_swapper()

        result = tgt_img.copy()

        # Swap onto all detected faces in target
        for i, tgt_face in enumerate(tgt_faces):
            print(f"Swapping face {i + 1}...")
            result = self.swapper.get(
                result,
                tgt_face,
                src_face,
                paste_back=True
            )

        # Ensure output directory exists
        output_dir = os.path.dirname(output_path)
        if output_dir:
            os.makedirs(output_dir, exist_ok=True)

        cv2.imwrite(output_path, result)

        print("\nSUCCESS")
        print(f"Saved to: {output_path}")
        print("===========================================\n")

        return True


def main():
    parser = argparse.ArgumentParser(description="InsightFace InSwapper Face Swap")
    parser.add_argument("--source", required=True, help="Path to source face image")
    parser.add_argument("--target", required=True, help="Path to target template image")
    parser.add_argument("--output", required=True, help="Path to save result image")
    parser.add_argument("--models", help="Specified models directory")
    parser.add_argument("--cpu", action="store_true", help="Force CPU mode")
    parser.add_argument("--gpu", action="store_true", help="Force GPU mode")
    args = parser.parse_args()

    use_gpu = args.gpu and not args.cpu
    pipeline = FaceSwapPipeline(use_gpu=use_gpu, models_dir=args.models)
    success = pipeline.swap(args.source, args.target, args.output)

    if not success:
        sys.exit(1)


if __name__ == "__main__":
    main()
