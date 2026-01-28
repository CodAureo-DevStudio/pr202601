import { initCommon } from './admin-common.js';
import { db, storage } from './firebase-config.js';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

initCommon();

// Gallery Rendering Logic
const galleryGrid = document.getElementById('gallery-grid');
const uploadBtnHtml = `
    <div class="upload-zone" onclick="openModal('modal-add-photo')">
        <i class="fas fa-plus" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
        <p>Adicionar Fotos</p>
    </div>
`;

if (galleryGrid) {
    const q = query(collection(db, "galeria"), orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
        // Clear grid but keep upload button
        galleryGrid.innerHTML = uploadBtnHtml;
        
        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            const id = docSnap.id;
            
            const itemContainer = document.createElement('div');
            itemContainer.className = 'gallery-item';
            itemContainer.innerHTML = `
                <img src="${data.imageUrl}" alt="${data.title || 'Galeria'}">
                <div class="gallery-item-overlay">
                    <div class="gallery-item-actions">
                        <button class="btn-action btn-delete" title="Excluir"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `;
            
            // Attach event listener directly
            const deleteBtn = itemContainer.querySelector('.btn-delete');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Avoid triggering any item click if added later
                window.deleteGalleryItem(id);
            });
            
            galleryGrid.appendChild(itemContainer);
        });
        
        const countText = document.querySelector('.card-header span');
        if (countText) countText.textContent = `${snapshot.size} fotos`;
    });
}

// Save Photo Logic (Direct Upload)
const btnSavePhoto = document.getElementById('btn-save-photo');
const fileInput = document.getElementById('input-photo-file');
const progressContainer = document.getElementById('upload-progress-container');
const progressBar = document.getElementById('upload-progress-bar');
const progressText = document.getElementById('upload-progress-text');
const previewContainer = document.getElementById('photo-preview-container');

// Preview Logic
if (fileInput) {
    fileInput.addEventListener('change', () => {
        previewContainer.innerHTML = '';
        const files = Array.from(fileInput.files);
        
        if (files.length > 10) {
            alert('Máximo 10 fotos por vez.');
            fileInput.value = '';
            return;
        }

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const div = document.createElement('div');
                div.style.width = '100%';
                div.style.aspectRatio = '1';
                div.style.borderRadius = '8px';
                div.style.overflow = 'hidden';
                div.style.border = '1px solid #e2e8f0';
                div.innerHTML = `<img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover;">`;
                previewContainer.appendChild(div);
            };
            reader.readAsDataURL(file);
        });
    });
}

if (btnSavePhoto) {
    btnSavePhoto.addEventListener('click', async () => {
        const files = Array.from(fileInput.files);
        const form = document.getElementById('form-add-photo');
        const formData = new FormData(form);
        const baseTitle = formData.get('photo_title');
        const baseDesc = formData.get('photo_desc');
        
        if (files.length === 0) {
            alert('Por favor, selecione ao menos uma foto.');
            return;
        }

        if (files.length > 10) {
            alert('Por favor, selecione no máximo 10 fotos por vez.');
            return;
        }

        btnSavePhoto.disabled = true;
        progressContainer.style.display = 'block';

        let successCount = 0;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileNum = i + 1;
            
            progressText.innerText = `Preparando arquivo ${fileNum} de ${files.length}...`;
            progressBar.style.width = '0%';

            try {
                // 1. Upload to Storage
                const storageRef = ref(storage, `galeria/${Date.now()}_${file.name}`);
                const uploadTask = uploadBytesResumable(storageRef, file);

                // Wait for this specific upload to finish
                await new Promise((resolve, reject) => {
                    uploadTask.on('state_changed', 
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            progressBar.style.width = progress + '%';
                            progressText.innerText = `Enviando (${fileNum}/${files.length}): ${Math.round(progress)}%`;
                        }, 
                        (error) => reject(error), 
                        async () => {
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            
                            const newPhoto = {
                                title: files.length > 1 ? `${baseTitle} (${fileNum})` : baseTitle,
                                description: baseDesc,
                                imageUrl: downloadURL,
                                createdAt: serverTimestamp()
                            };

                            await addDoc(collection(db, "galeria"), newPhoto);
                            successCount++;
                            resolve();
                        }
                    );
                });
            } catch (error) {
                console.error(`Erro no arquivo ${fileNum}:`, error);
            }
        }

        if (successCount > 0) {
            alert(`${successCount} fotos adicionadas com sucesso!`);
            window.closeModal('modal-add-photo');
            form.reset();
            if (previewContainer) previewContainer.innerHTML = '';
        } else {
            alert('Erro ao enviar as fotos. Tente novamente.');
        }

        progressContainer.style.display = 'none';
        progressBar.style.width = '0%';
        btnSavePhoto.disabled = false;
        btnSavePhoto.innerText = 'Adicionar Foto';
    });
}

window.deleteGalleryItem = async (id) => {
    if (!confirm('Excluir imagem da galeria? Isso removerá a foto permanentemente do site.')) return;

    try {
        console.log('Tentando excluir documento:', id);
        const docRef = doc(db, "galeria", id);
        await deleteDoc(docRef);
        console.log('Documento excluído com sucesso do Firestore.');
        alert('Foto removida com sucesso!');
        // Note: UI will update automatically via onSnapshot
    } catch (error) {
        console.error("Erro ao excluir documento:", error);
        alert('Erro ao excluir a foto: ' + error.message);
    }
};
