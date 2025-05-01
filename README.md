# Proyecto Web GitHub Downloader

Este proyecto es una página web que permite a los usuarios descargar archivos y directorios de un repositorio de GitHub. Los usuarios pueden ingresar la URL del repositorio, elegir la rama y la carpeta que desean descargar, y la aplicación procesará los archivos, generando un archivo comprimido (.zip) para la descarga.

## Características

- Permite ingresar una URL de GitHub, proporcionando acceso a cualquier repositorio público.
- Descarga archivos y directorios de forma recursiva desde cualquier ruta dentro del repositorio.
- Genera automáticamente un archivo `.zip` que incluye los archivos seleccionados.
- Muestra una barra de progreso durante el proceso de descarga.
- Permite la autenticación mediante un token de acceso personal para superar el límite de peticiones de GitHub.
- Interfaz simple y fácil de usar con un diseño moderno y responsivo.

## Tecnologías utilizadas

- **HTML**: Estructura básica de la página.
- **CSS**: Estilo visual del sitio.
- **JavaScript**: Lógica para interactuar con la API de GitHub, manejar la descarga de archivos y actualizar la interfaz de usuario.
- **JSZip**: Librería para crear y manejar archivos ZIP directamente en el navegador.
- **GitHub API**: Usada para interactuar con los repositorios y obtener los archivos y directorios.

## Cómo utilizar

1. Ingrese la URL del repositorio de GitHub en el campo correspondiente.
2. (Opcional) Proporcione un token de acceso personal si desea evitar el límite de 60 peticiones por hora.
3. Haga clic en el botón de descarga y espere a que se procesen los archivos.
4. La página generará un archivo `.zip` que podrá descargar una vez que se complete la operación.

## Instalación

Este proyecto se puede ejecutar directamente desde cualquier navegador moderno sin necesidad de instalación adicional. Simplemente descargue o clone este repositorio y abra el archivo `index.html` en su navegador.

## Contribuciones

Si deseas contribuir a este proyecto, puedes hacer un fork del repositorio, realizar tus mejoras y enviar un pull request con tus cambios.

## Licencia

Este proyecto está bajo la Licencia MIT - vea el archivo [LICENSE](LICENSE) para más detalles.
