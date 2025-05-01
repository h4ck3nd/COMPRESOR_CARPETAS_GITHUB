document.getElementById('download-btn').addEventListener('click', async () => {
    const urlInput = document.getElementById('github-url').value.trim();
    const token = document.getElementById('github-token').value.trim();
    const status = document.getElementById('status');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const fileNamesList = document.getElementById('file-names');
  
    status.textContent = 'Procesando...';
    progressBar.style.width = '0%';
    progressText.textContent = '0 / 0 archivos';
    fileNamesList.innerHTML = '';
  
    try {
      const { owner, repo, branch, path } = parseGitHubURL(urlInput);
      const zip = new JSZip();
  
      let totalFiles = 0;
      let processedFiles = 0;
  
      await collectFiles(owner, repo, branch, path, token, zip, path, fileNamesList, progressBar, progressText, () => {
        totalFiles++;
      }, () => {
        processedFiles++;
        updateProgressBar(progressBar, progressText, processedFiles, totalFiles);
      });
  
      const content = await zip.generateAsync({ type: 'blob' });
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(content);
      downloadLink.download = `${path.split('/').pop() || repo}.zip`;
      downloadLink.click();
  
      status.textContent = '¡Descarga completada!';

        // Redirigir después de 5 segundos
        setTimeout(() => {
            window.location.href = 'index.html'; // Redirige a index.html
        }, 5000); // 5000ms = 5 segundos

    } catch (error) {
        console.error(error);
        if (error.message === "LIMIT_EXCEEDED") {
          status.textContent = "Has alcanzado el límite de peticiones anónimas. Introduce un token personal.";
        } else if (error.message === "FORBIDDEN") {
          status.textContent = "Acceso denegado. Revisa tu token o permisos del repositorio.";
        } else {
          status.textContent = "Error al procesar la URL.";
        }
        document.getElementById('progress-container').style.display = 'none';
      }
  });
  
  function parseGitHubURL(url) {
    const regex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/tree\/([^\/]+)\/(.+)/;
    const match = url.match(regex);
    if (!match) throw new Error('URL de GitHub no válida.');
    return {
      owner: match[1],
      repo: match[2],
      branch: match[3],
      path: match[4]
    };
  }
  
  async function collectFiles(owner, repo, branch, path, token, zip, rootPath, fileNamesList, progressBar, progressText, onFileFound, onFileProcessed) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
    const response = await fetch(apiUrl, { headers });
    
    if (response.status === 403) {
      const errorJson = await response.json();
      if (errorJson.message && errorJson.message.includes("API rate limit exceeded")) {
        throw new Error("LIMIT_EXCEEDED");
      } else {
        throw new Error("FORBIDDEN");
      }
    }
    if (!response.ok) throw new Error('No se pudo obtener el contenido del directorio.');
    

    if (!response.ok) throw new Error('No se pudo obtener el contenido del directorio.');
    const items = await response.json();
  
    if (!Array.isArray(items)) throw new Error('La respuesta no contiene una lista de archivos.');
  
    const stack = [{ items, basePath: path }];
  
    while (stack.length > 0) {
      const { items, basePath } = stack.pop();
      for (const item of items) {
        const relativePath = item.path.replace(`${rootPath}/`, '');
        const li = document.createElement('li');
        li.textContent = item.path;
        fileNamesList.appendChild(li);
        onFileFound();
  
        if (item.type === 'file') {
          const fileRes = await fetch(item.url, { headers });
          if (!fileRes.ok) {
            console.warn(`No se pudo descargar: ${item.path}`);
            continue;
          }
          const fileJson = await fileRes.json();
          const content = atob(fileJson.content.replace(/\n/g, ''));
          zip.file(relativePath, content);
          onFileProcessed();
        } else if (item.type === 'dir') {
            const dirUrl = item.url.includes('?') ? item.url : `${item.url}?ref=${branch}`;
            const subRes = await fetch(dirUrl, { headers });
            if (!subRes.ok) {
              console.warn(`No se pudo acceder a la carpeta: ${item.path}`);
              continue;
            }
            const subItems = await subRes.json();
            if (!Array.isArray(subItems)) continue;
            stack.push({ items: subItems, basePath: item.path });
          }          
      }
    }
  }
  
  function updateProgressBar(progressBar, progressText, processed, total) {
    const percent = total ? (processed / total) * 100 : 0;
    progressBar.style.width = `${percent}%`;
    progressText.textContent = `${processed} / ${total} archivos`;
  }
  