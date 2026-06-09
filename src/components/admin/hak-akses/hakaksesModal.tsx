    import { useState, useEffect } from 'react'
    import { toast } from 'sonner'
    import { Icon } from '@iconify/react'
    import { Spinner } from '@/components/ui/spinner'

    interface Permission {
    id: number
    name: string
    description: string
    }

    interface Role {
    id: number
    name?: string
    email?: string
    role?: { id: number; roleName: string }
    permissions: Permission[]
    }

    interface HakAksesModalProps {
    isOpen: boolean
    onClose: () => void
    role: Role | null
    onSuccess: (message: string) => void
    }

    function HakAksesModal({ isOpen, onClose, role, onSuccess }: HakAksesModalProps) {
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([])
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)


    useEffect(() => {
        if (isOpen) {
        const fetchPermissions = async () => {
            setLoading(true)
            try {
            const res = await fetch('/api/permissions')
            const data = await res.json()
            if (data.success) {
                setAvailablePermissions(data.data || [])
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (_err) {
            toast.error('Gagal memuat daftar permission')
            } finally {
            setLoading(false)
            }
        }
        fetchPermissions()
        }
    }, [isOpen])

    useEffect(() => {
        if (role && role.permissions) {
        setSelectedIds(role.permissions.map((p: Permission) => p.id))
        }
    }, [role])

    const togglePermission = (id: number) => {
    // prev adalah array [1, 2, 5...]
    setSelectedIds((prev) => {
        if (prev.includes(id)) {
        // Jika sudah ada, hapus (Uncheck)
        return prev.filter((x) => x !== id);
        } else {
        // Jika belum ada, tambahkan (Check)
        return [...prev, id];
        }
    });
    };

    const handleSave = async () => {
        if (!role) return
        setSaving(true)
        try {
        const res = await fetch(`/api/hak-akses/${role.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ permissionIds: selectedIds }),
        })

        // 1. Ambil teks mentah dulu
        const text = await res.text();
        
        // 2. Jika res.ok (status 200-299), anggap berhasil meskipun respon kosong
        if (res.ok) {
            onSuccess('Hak akses berhasil diperbarui');
            onClose();
            return;
        }

        let result;
        try {
            result = text ? JSON.parse(text) : {};
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            throw new Error('Server error: ' + text);
        }
        
        throw new Error(result.message || 'Gagal menyimpan perubahan');
        
        } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Terjadi kesalahan')
        } finally {
        setSaving(false)
        }
    }

    if (!isOpen || !role) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900 font-poppins">Atur Hak Akses</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer">
                <Icon icon="tabler:x" className="text-lg" />
            </button>
            </div>

            {loading ? (
            <div className="py-10 flex justify-center"><Spinner /></div>
            ) : (
            <div className="flex flex-col gap-2.5 mb-6 max-h-[60vh] overflow-y-auto pr-2">
                {availablePermissions.map((perm) => {
                const checked = selectedIds.includes(perm.id)
                const cleanedName = perm.name.replace(/^(menu:|action:)/, '');
                return (
                    <label
                    key={perm.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                        checked ? 'border-[#2848b7]/40 bg-blue-50/50' : 'border-gray-100 hover:bg-gray-50'
                    }`}
                    >
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => togglePermission(perm.id)}
                        className="w-4 h-4 accent-[#2848b7] cursor-pointer"
                    />
                    <div>
                        <p className="text-sm font-semibold text-gray-800 first-letter:uppercase">{cleanedName}</p>
                        <p className="text-xs text-gray-400">{perm.description}</p>
                    </div>
                    </label>
                )
                })}
            </div>
            )}

            <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold cursor-pointer">
                Batal
            </button>
            <button 
                onClick={handleSave} 
                disabled={saving || loading}
                className="flex-1 py-2.5 rounded-xl bg-[#2848b7] text-white text-sm font-semibold cursor-pointer flex items-center justify-center gap-2"
            >
                {saving ? <Spinner className="size-4" /> : 'Simpan'}
            </button>
            </div>
        </div>
        </div>
    )
    }

    export default HakAksesModal;