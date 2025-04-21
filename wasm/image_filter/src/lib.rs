use wasm_bindgen::prelude::*;

// Este filtro convierte cada píxel a escala de grises.
#[wasm_bindgen]
pub fn grayscale(input: &[u8]) -> Vec<u8> {
    let mut output = Vec::with_capacity(input.len());
    for i in (0..input.len()).step_by(4) {
        let r = input[i] as f32;
        let g = input[i + 1] as f32;
        let b = input[i + 2] as f32;
        let gray = ((r + g + b) / 3.0) as u8;
        output.push(gray);
        output.push(gray);
        output.push(gray);
        output.push(input[i + 3]);
    }
    output
}

// Este filtro invierte los colores de cada píxel.
#[wasm_bindgen]
pub fn invert(input: &[u8]) -> Vec<u8> {
    let mut output = Vec::with_capacity(input.len());
    for i in (0..input.len()).step_by(4) {
        output.push(255 - input[i]);
        output.push(255 - input[i + 1]);
        output.push(255 - input[i + 2]);
        output.push(input[i + 3]);
    }
    output
}

// Filtro Sepia
#[wasm_bindgen]
pub fn sepia(input: &[u8]) -> Vec<u8> {
    let mut output = Vec::with_capacity(input.len());
    for i in (0..input.len()).step_by(4) {
        let r = input[i] as f32;
        let g = input[i + 1] as f32;
        let b = input[i + 2] as f32;

        let tr = (0.393 * r + 0.769 * g + 0.189 * b).min(255.0) as u8;
        let tg = (0.349 * r + 0.686 * g + 0.168 * b).min(255.0) as u8;
        let tb = (0.272 * r + 0.534 * g + 0.131 * b).min(255.0) as u8;

        output.push(tr);
        output.push(tg);
        output.push(tb);
        output.push(input[i + 3]);
    }
    output
}

// Filtro Brillo
#[wasm_bindgen]
pub fn brightness(input: &[u8], factor: f32) -> Vec<u8> {
    let mut output = Vec::with_capacity(input.len());
    for i in (0..input.len()).step_by(4) {
        let r = (input[i] as f32 * factor).min(255.0) as u8;
        let g = (input[i + 1] as f32 * factor).min(255.0) as u8;
        let b = (input[i + 2] as f32 * factor).min(255.0) as u8;
        output.push(r);
        output.push(g);
        output.push(b);
        output.push(input[i + 3]);
    }
    output
}

// Filtro Contraste
#[wasm_bindgen]
pub fn contrast(input: &[u8], factor: f32) -> Vec<u8> {
    let mut output = Vec::with_capacity(input.len());
    for i in (0..input.len()).step_by(4) {
        let r = ((input[i] as f32 - 128.0) * factor + 128.0).min(255.0).max(0.0) as u8;
        let g = ((input[i + 1] as f32 - 128.0) * factor + 128.0).min(255.0).max(0.0) as u8;
        let b = ((input[i + 2] as f32 - 128.0) * factor + 128.0).min(255.0).max(0.0) as u8;
        output.push(r);
        output.push(g);
        output.push(b);
        output.push(input[i + 3]);
    }
    output
}
