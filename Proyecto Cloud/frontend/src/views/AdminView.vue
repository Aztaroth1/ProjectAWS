<script setup>
import { ref, onMounted } from 'vue';
import { getProducts, createProduct, deleteProduct, updateProduct } from '@/api/productService';

const products = ref([]);
const isEditing = ref(false);
const editingId = ref(null);

// Modelo del formulario
const form = ref({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: null // Aquí guardaremos el archivo
});

// Cargar productos
async function loadProducts() {
    products.value = await getProducts();
}

// Manejar selección de archivo
function handleFileUpload(event) {
    form.value.image = event.target.files[0];
}

// Guardar (Crear o Editar)
async function saveProduct() {
    try {
        // Usamos FormData porque vamos a enviar un archivo
        const formData = new FormData();
        formData.append('name', form.value.name);
        formData.append('description', form.value.description);
        formData.append('price', form.value.price);
        formData.append('stock', form.value.stock);
        
        if (form.value.image) {
            formData.append('image', form.value.image);
        }

        if (isEditing.value) {
            await updateProduct(editingId.value, formData);
            alert('Producto actualizado');
        } else {
            await createProduct(formData);
            alert('Producto creado');
        }

        resetForm();
        loadProducts();
    } catch (error) {
        alert('Error al guardar: ' + error.response?.data?.error || error.message);
    }
}

// Preparar edición
function editItem(product) {
    isEditing.value = true;
    editingId.value = product.id;
    // Llenamos el formulario con los datos actuales
    form.value.name = product.name;
    form.value.description = product.description;
    form.value.price = product.price;
    form.value.stock = product.stock;
    form.value.image = null; // La imagen no se puede pre-cargar en un input file
}

// Eliminar
async function deleteItem(id) {
    if(!confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
        await deleteProduct(id);
        loadProducts();
    } catch (error) {
        alert('Error al eliminar');
    }
}

function resetForm() {
    isEditing.value = false;
    editingId.value = null;
    form.value = { name: '', description: '', price: '', stock: '', image: null };
    // Limpiar input file visualmente (truco rápido)
    document.getElementById('fileInput').value = '';
}

function getImageUrl(imagePath) {
    if (!imagePath) return '';
    // Si ya es una URL completa (ej: http://example.com), la dejamos igual
    if (imagePath.startsWith('http')) return imagePath;
    
    // Si es una ruta local, le pegamos el dominio del backend y corregimos barras de Windows
    // Reemplazamos '\' por '/'
    return `http://localhost:3000/${imagePath.replace(/\\/g, '/')}`;
}
onMounted(loadProducts);
</script>

<template>
    <div class="admin-panel">
        <h1>⚙️ Panel de Administración</h1>

        <div class="admin-form">
            <h2>{{ isEditing ? 'Editar Producto' : 'Nuevo Producto' }}</h2>
            <form @submit.prevent="saveProduct">
                <input v-model="form.name" placeholder="Nombre del producto" required />
                <textarea v-model="form.description" placeholder="Descripción"></textarea>
                <div class="row">
                    <input v-model="form.price" type="number" step="0.01" placeholder="Precio" required />
                    <input v-model="form.stock" type="number" placeholder="Stock" required />
                </div>
                <input id="fileInput" type="file" @change="handleFileUpload" :required="!isEditing" />
                
                <div class="buttons">
                    <button type="submit" class="save-btn">{{ isEditing ? 'Actualizar' : 'Crear' }}</button>
                    <button type="button" v-if="isEditing" @click="resetForm" class="cancel-btn">Cancelar</button>
                </div>
            </form>
        </div>

        <div class="product-table-container">
            <table>
                <thead>
                    <tr>
                        <th>Img</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="p in products" :key="p.id">
                        <td>
                             <img :src="getImageUrl(p.image_url)" class="thumb" />
                        </td>
                        <td>{{ p.name }}</td>
                        <td>${{ parseFloat(p.price).toFixed(2) }}</td>
                        <td>{{ p.stock }}</td>
                        <td>
                            <button @click="editItem(p)" class="edit-btn">✏️</button>
                            <button @click="deleteItem(p.id)" class="delete-btn">🗑️</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
.admin-panel { padding: 20px; max-width: 1000px; margin: 0 auto; }
.admin-form { background: #f4f4f4; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
.admin-form input, .admin-form textarea { width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px; }
.row { display: flex; gap: 10px; }
.save-btn { background: #28a745; color: white; padding: 10px 20px; border: none; cursor: pointer; }
.cancel-btn { background: #6c757d; color: white; padding: 10px 20px; border: none; cursor: pointer; margin-left: 10px; }

table { width: 100%; border-collapse: collapse; margin-top: 20px; }
th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
th { background-color: #333; color: white; }
.thumb { width: 50px; height: 50px; object-fit: cover; }
.edit-btn, .delete-btn { padding: 5px 10px; margin-right: 5px; cursor: pointer; border: none; }
.edit-btn { background: #ffc107; }
.delete-btn { background: #dc3545; color: white; }
</style>