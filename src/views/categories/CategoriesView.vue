<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 class="text-xl font-bold text-neutral-900 tracking-tight">Categories Management</h2>
        <p class="text-xs text-neutral-500 mt-0.5">Organize venue classifications and directory taxonomy</p>
      </div>

      <button
        @click="openCreateModal"
        type="button"
        class="inline-flex items-center px-3.5 py-1.5 bg-[#f25c05] hover:bg-[#dc5202] text-white text-xs font-medium rounded-md transition-colors"
      >
        <svg class="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Category
      </button>
    </div>

    <!-- Feedback Banners -->
    <div
      v-if="successMessage"
      class="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center justify-between"
    >
      <span>{{ successMessage }}</span>
      <button @click="successMessage = null" class="text-emerald-600 hover:text-emerald-900 font-bold ml-2">×</button>
    </div>

    <div
      v-if="actionError"
      class="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs flex items-center justify-between"
    >
      <span>{{ actionError }}</span>
      <button @click="actionError = null" class="text-red-600 hover:text-red-900 font-bold ml-2">×</button>
    </div>

    <!-- Error State -->
    <ErrorState
      v-if="error"
      title="Failed to load categories"
      :message="error"
      @retry="fetchCategories"
    />

    <!-- Main Container -->
    <div v-else class="bg-white border border-[#e7e5e1] rounded-lg overflow-hidden">
      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="p-6">
        <LoadingSkeleton :rows="6" />
      </div>

      <!-- Empty State -->
      <EmptyState
        v-else-if="categories.length === 0"
        title="No categories found"
        description="There are currently no categories configured in the platform."
      >
        <template #action>
          <button
            @click="openCreateModal"
            type="button"
            class="px-3 py-1.5 bg-[#f25c05] text-white text-xs font-medium rounded-md"
          >
            Create First Category
          </button>
        </template>
      </EmptyState>

      <!-- Table View -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-[#e7e5e1] bg-neutral-50/75 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
              <th class="py-3 px-4 w-16">Sort</th>
              <th class="py-3 px-4">Name</th>
              <th class="py-3 px-4">Slug</th>
              <th class="py-3 px-4">Assigned Venues</th>
              <th class="py-3 px-4">Status</th>
              <th class="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#e7e5e1] text-xs">
            <tr
              v-for="cat in categories"
              :key="cat.id"
              class="hover:bg-neutral-50/50 transition-colors"
            >
              <td class="py-3 px-4 font-mono text-neutral-400 font-medium">
                {{ cat.sort_order }}
              </td>
              <td class="py-3 px-4">
                <div class="font-semibold text-neutral-900 flex items-center space-x-2">
                  <span v-if="cat.icon" class="text-neutral-500 font-mono text-[11px] bg-neutral-100 px-1 py-0.5 rounded">
                    {{ cat.icon }}
                  </span>
                  <span>{{ cat.name }}</span>
                </div>
                <div v-if="cat.description" class="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                  {{ cat.description }}
                </div>
              </td>
              <td class="py-3 px-4 font-mono text-neutral-600">
                {{ cat.slug }}
              </td>
              <td class="py-3 px-4">
                <span class="inline-flex items-center px-2 py-0.5 bg-neutral-100 rounded text-neutral-700 font-medium text-[11px]">
                  {{ cat.venues_count ?? 0 }} venues
                </span>
              </td>
              <td class="py-3 px-4">
                <StatusBadge :status="cat.is_active ? 'active' : 'inactive'" />
              </td>
              <td class="py-3 px-4 text-right space-x-1.5">
                <button
                  @click="openEditModal(cat)"
                  type="button"
                  class="px-2.5 py-1 text-neutral-700 bg-neutral-100 hover:bg-neutral-200 font-medium rounded text-[11px] transition-colors"
                >
                  Edit
                </button>
                <button
                  @click="promptDelete(cat)"
                  type="button"
                  class="px-2.5 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 font-medium rounded text-[11px] transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create / Edit Category Modal -->
    <BaseModal
      :is-open="formModalOpen"
      :title="isEditing ? 'Edit Category' : 'Create New Category'"
      @close="closeFormModal"
    >
      <form @submit.prevent="submitCategoryForm" class="space-y-3.5 text-xs">
        <div v-if="modalError" class="p-2.5 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
          {{ modalError }}
        </div>

        <!-- Name -->
        <div>
          <label for="cat-name" class="block font-medium text-neutral-700 mb-1">
            Category Name <span class="text-red-500">*</span>
          </label>
          <input
            id="cat-name"
            v-model="categoryForm.name"
            type="text"
            required
            maxlength="100"
            placeholder="e.g. Badminton Courts"
            class="w-full text-xs px-3 py-1.5 border border-neutral-300 rounded-md focus:outline-none focus:border-[#f25c05]"
            :class="{ 'border-red-400': validationErrors.name }"
          />
          <p v-if="validationErrors.name" class="text-[11px] text-red-600 mt-1">
            {{ validationErrors.name[0] }}
          </p>
        </div>

        <!-- Slug -->
        <div>
          <label for="cat-slug" class="block font-medium text-neutral-700 mb-1">
            Slug <span class="text-neutral-400 font-normal">(optional, auto-generated if blank)</span>
          </label>
          <input
            id="cat-slug"
            v-model="categoryForm.slug"
            type="text"
            maxlength="120"
            placeholder="e.g. badminton-courts"
            class="w-full text-xs font-mono px-3 py-1.5 border border-neutral-300 rounded-md focus:outline-none focus:border-[#f25c05]"
            :class="{ 'border-red-400': validationErrors.slug }"
          />
          <p v-if="validationErrors.slug" class="text-[11px] text-red-600 mt-1">
            {{ validationErrors.slug[0] }}
          </p>
        </div>

        <!-- Description -->
        <div>
          <label for="cat-description" class="block font-medium text-neutral-700 mb-1">Description</label>
          <textarea
            id="cat-description"
            v-model="categoryForm.description"
            rows="2"
            placeholder="Brief description of this facility category..."
            class="w-full text-xs px-3 py-1.5 border border-neutral-300 rounded-md focus:outline-none focus:border-[#f25c05]"
          ></textarea>
        </div>

        <!-- Icon & Sort Order -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label for="cat-icon" class="block font-medium text-neutral-700 mb-1">Icon Identifier</label>
            <input
              id="cat-icon"
              v-model="categoryForm.icon"
              type="text"
              maxlength="100"
              placeholder="e.g. sports_badminton"
              class="w-full text-xs px-3 py-1.5 border border-neutral-300 rounded-md focus:outline-none focus:border-[#f25c05]"
            />
          </div>

          <div>
            <label for="cat-sort-order" class="block font-medium text-neutral-700 mb-1">Sort Order</label>
            <input
              id="cat-sort-order"
              v-model.number="categoryForm.sort_order"
              type="number"
              min="0"
              class="w-full text-xs px-3 py-1.5 border border-neutral-300 rounded-md focus:outline-none focus:border-[#f25c05]"
            />
          </div>
        </div>

        <!-- Is Active Checkbox -->
        <div class="flex items-center space-x-2 pt-1">
          <input
            id="cat-is-active"
            v-model="categoryForm.is_active"
            type="checkbox"
            class="rounded border-neutral-300 text-[#f25c05] focus:ring-[#f25c05]"
          />
          <label for="cat-is-active" class="font-medium text-neutral-700">
            Active in platform directory
          </label>
        </div>

        <!-- Form Actions -->
        <div class="pt-3 border-t border-neutral-200 flex justify-end space-x-2">
          <button
            @click="closeFormModal"
            :disabled="isSubmitting"
            type="button"
            class="px-3.5 py-1.5 border border-neutral-300 hover:bg-neutral-100 disabled:opacity-50 text-neutral-700 text-xs font-medium rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            :disabled="isSubmitting"
            type="submit"
            class="px-3.5 py-1.5 bg-[#f25c05] hover:bg-[#dc5202] disabled:opacity-50 text-white text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5"
          >
            <span v-if="isSubmitting" class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span>{{ isEditing ? 'Save Changes' : 'Create Category' }}</span>
          </button>
        </div>
      </form>
    </BaseModal>

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      :is-open="deleteModalOpen"
      title="Delete Category"
      :message="deleteMessage"
      confirm-text="Delete Category"
      variant="danger"
      :is-loading="isDeleting"
      @confirm="executeDelete"
      @cancel="deleteModalOpen = false"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import categoryService from '../../services/category.service'
import StatusBadge from '../../components/feedback/StatusBadge.vue'
import LoadingSkeleton from '../../components/feedback/LoadingSkeleton.vue'
import EmptyState from '../../components/feedback/EmptyState.vue'
import ErrorState from '../../components/feedback/ErrorState.vue'
import BaseModal from '../../components/overlays/BaseModal.vue'
import ConfirmModal from '../../components/overlays/ConfirmModal.vue'

const categories = ref([])
const isLoading = ref(true)
const error = ref(null)
const successMessage = ref(null)
const actionError = ref(null)

// Create / Edit Modal State
const formModalOpen = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const isSubmitting = ref(false)
const modalError = ref(null)
const validationErrors = ref({})

const categoryForm = reactive({
  name: '',
  slug: '',
  description: '',
  icon: '',
  sort_order: 0,
  is_active: true,
})

// Delete Modal State
const deleteModalOpen = ref(false)
const deletingCategory = ref(null)
const isDeleting = ref(false)

const deleteMessage = computed(() => {
  if (!deletingCategory.value) return ''
  const venues = deletingCategory.value.venues_count ?? 0
  if (venues > 0) {
    return `Warning: Category "${deletingCategory.value.name}" currently has ${venues} assigned venue(s). The backend prevents deleting categories that have active venues.`
  }
  return `Are you sure you want to permanently delete "${deletingCategory.value.name}"? This action cannot be undone.`
})

async function fetchCategories() {
  isLoading.value = true
  error.value = null
  try {
    categories.value = await categoryService.list()
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to retrieve categories.'
  } finally {
    isLoading.value = false
  }
}

function openCreateModal() {
  isEditing.value = false
  editingId.value = null
  categoryForm.name = ''
  categoryForm.slug = ''
  categoryForm.description = ''
  categoryForm.icon = ''
  categoryForm.sort_order = 0
  categoryForm.is_active = true
  modalError.value = null
  validationErrors.value = {}
  formModalOpen.value = true
}

function openEditModal(cat) {
  isEditing.value = true
  editingId.value = cat.id
  categoryForm.name = cat.name
  categoryForm.slug = cat.slug || ''
  categoryForm.description = cat.description || ''
  categoryForm.icon = cat.icon || ''
  categoryForm.sort_order = cat.sort_order ?? 0
  categoryForm.is_active = !!cat.is_active
  modalError.value = null
  validationErrors.value = {}
  formModalOpen.value = true
}

function closeFormModal() {
  if (isSubmitting.value) return
  formModalOpen.value = false
}

async function submitCategoryForm() {
  isSubmitting.value = true
  modalError.value = null
  validationErrors.value = {}

  try {
    const payload = {
      name: categoryForm.name.trim(),
      slug: categoryForm.slug?.trim() || undefined,
      description: categoryForm.description?.trim() || undefined,
      icon: categoryForm.icon?.trim() || undefined,
      sort_order: Number(categoryForm.sort_order) || 0,
      is_active: Boolean(categoryForm.is_active),
    }

    if (isEditing.value) {
      const res = await categoryService.update(editingId.value, payload)
      successMessage.value = res.message || 'Category updated successfully.'
    } else {
      const res = await categoryService.create(payload)
      successMessage.value = res.message || 'Category created successfully.'
    }

    formModalOpen.value = false
    await fetchCategories()
  } catch (err) {
    if (err.response?.status === 422) {
      validationErrors.value = err.response.data?.errors || {}
      modalError.value = err.response.data?.message || 'Validation failed. Please correct the fields.'
    } else {
      modalError.value = err.response?.data?.message || 'Failed to save category.'
    }
  } finally {
    isSubmitting.value = false
  }
}

function promptDelete(cat) {
  deletingCategory.value = cat
  deleteModalOpen.value = true
}

async function executeDelete() {
  if (!deletingCategory.value) return
  isDeleting.value = true
  actionError.value = null
  try {
    const res = await categoryService.delete(deletingCategory.value.id)
    successMessage.value = res.message || 'Category deleted successfully.'
    deleteModalOpen.value = false
    await fetchCategories()
  } catch (err) {
    // Show deletion error (e.g., if venues are assigned, backend 422 is returned)
    actionError.value = err.response?.data?.message || 'Failed to delete category.'
    deleteModalOpen.value = false
  } finally {
    isDeleting.value = false
  }
}

onMounted(() => {
  fetchCategories()
})
</script>
