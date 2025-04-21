# 2025-1-s1-g6-t2

## Para esta tarea se implementó un editor de imagenes. Antes de poder correr este codigó se debe seguir una serie de pasos para evitar posibles errores en la parte de WASM:
### 1. Primero se debe tener instalado Rust y wasm-pack, estos se pueden instalar con el comando sh y luego cargo install wasm-pack
### 2. se debe estar en la carpeta wasm (cd wasm) y luego en image-filter.
### 3. Compilar con wasm-pack build --target web. Esto genera la carpeta pkg/ la cual debe ser copiada y pegada en el archivo client/public.

##