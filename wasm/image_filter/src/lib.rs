use wasm_bindgen::prelude::*;

// Este filtro convierte cada píxel a escala de grises.
#[wasm_bindgen]
pub fn grayscale(input: &[u8]) -> Vec<u8> {
    let mut output = Vec::with_capacity(input.len());
    for i in (0..input.len()).step_by(4) {
        // Se asume que el arreglo está en formato RGBA
        let r = input[i] as f32;
        let g = input[i + 1] as f32;
        let b = input[i + 2] as f32;
        // Se calcula un promedio sencillo para obtener el valor en escala de grises
        let gray = ((r + g + b) / 3.0) as u8;
        output.push(gray);         // R
        output.push(gray);         // G
        output.push(gray);         // B
        output.push(input[i + 3]); // A (transparencia sin cambios)
    }
    output
}

// Este filtro invierte los colores de cada píxel.
#[wasm_bindgen]
pub fn invert(input: &[u8]) -> Vec<u8> {
    let mut output = Vec::with_capacity(input.len());
    for i in (0..input.len()).step_by(4) {
        // Invertir canales R, G y B
        output.push(255 - input[i]);      // R
        output.push(255 - input[i + 1]);  // G
        output.push(255 - input[i + 2]);  // B
        output.push(input[i + 3]);        // Deja alfa sin cambios
    }
    output
}
