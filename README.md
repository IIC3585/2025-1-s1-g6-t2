# 2025-1-s1-g6-t2
## Para esta tarea se implementó una serie de filtros de imagen utilizando WebAssembly (wasm), facilitando su integración en aplicaciones web. Antes de poder correr este codigó se debe seguir una serie de pasos para evitar posibles errores en la parte de WASM:
### 1. Primero se debe tener instalado Rust y wasm-pack, estos se pueden instalar con el comando sh y luego cargo install wasm-pack
### 2. se debe estar en la carpeta wasm (cd wasm) y luego en image-filter.
### 3. Compilar con wasm-pack build --target web. Esto genera la carpeta pkg/ la cual debe ser copiada y pegada en el archivo client/public.

## En cuanto a los filtros utilizados según nuestra creatividad se encuentran los siguiente:
### 1. Grayscale: Convierte la imagen a una en escala de grises
### 2. Invert: Invierte los colores de cada pixel, se podría decir quees una especie de efecto negativo.
### 3. sepia: Aplica un efeto sepia con tonos calidos marrón-dprado
### 4. brightness: Ajusta el brillo, esto se hace multiplicando los valores por un factor, para este se tiene una barra y se debe procesar la imagen cuando se mueve esta.
### 5. contrast: Cambia el contraste de la imagen, para esto al igual que "brightness" tiene una barra para elegir el punto de contraste que se quiere.

## Otras Funcionalidades

## Se tiene un navbar para moverse entre los distintos componentes de la web.

## Todas las imágenes procesadas mediante los filtros pueden ser guardadas en una base de datos para que los usuarios puedan conservarlas.

## Existe una sección de Galería, donde se pueden visualizar las imágenes guardadas. Por lo mismo el usuario puede eliminar las imagenes si el lo desea.

## También se incluye una sección de "Nosotros", que aunque es simple, presenta el objetivo general del proyecto.

## En el componente de estilos se puede cambiar la configuración los estilos de la pagina (valga la redundancia), por ejemplo el tipo de letra, fondo oscuro o claro, entre otros.