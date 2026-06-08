import { Spinner } from '@/components/ui/spinner'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { AnimatePresence, motion } from 'motion/react'

interface UserProps {
  id: number
  name: string
  email: string
  role: {
    id: number
    roleName: string
  } | null
}

type Props = {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  user?: UserProps | null
}

export default function UserModal({ isOpen, onClose, onSuccess, user }: Props) {
  const [roleId, setRoleId] = useState<number | string>('')
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (user && isOpen) {
      setRoleId(user.role?.id || '')
    } else if (isOpen) {
      setRoleId('')
    }
  }, [user, isOpen])

  const isDirty = user ? Number(roleId) !== (user.role?.id || 0) : roleId !== ''

  const handleClose = () => {
    if (isDirty) {
      setShowConfirm(true)
    } else {
      onClose()
    }
  }

  const handleConfirmClose = () => {
    setShowConfirm(false)
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      setLoading(true)
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId: Number(roleId) }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        if (onSuccess) onSuccess()
        onClose()
        window.location.reload()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && user && (
          <motion.div
            className="fixed inset-0 z-9999 flex items-center justify-center bg-[#1e1e1e]/50 p-8 outline-none focus:outline-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
          >
            <motion.div
              className="mx-auto w-full max-w-lg"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex w-full flex-col rounded-4xl border-0 bg-cream-light shadow-xl outline-none focus:outline-none">
                <div className="flex flex-col rounded-t-4xl gap-1 p-8 pb-0">
                  <h3 className="text-h5 font-bold font-poppins text-dark flex md:justify-center md:items-center">
                    Edit Role User
                  </h3>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col px-8 pt-6 gap-4">
                    <div>
                      <label className="mb-1 block text-xs font-poppins font-medium text-cream-dark">
                        Nama User
                      </label>
                      <p className="text-body font-poppins font-bold text-dark">
                        {user.name}
                      </p>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-poppins font-medium text-cream-dark">
                        Email
                      </label>
                      <p className="text-body font-poppins text-gray-600">
                        {user.email}
                      </p>
                    </div>

                    <div className="mb-4">
                      <label className="mb-2 block text-body font-poppins font-bold text-royale">
                        Hak Akses / Role
                      </label>
                      <select
                        value={roleId}
                        onChange={(e) => setRoleId(e.target.value)}
                        className="w-full rounded-lg ring ring-(--cream-active) px-3.25 bg-white text-primary outline-none focus:ring-2 focus:ring-(--royale) h-12.5 cursor-pointer"
                        required
                      >
                        <option value="1">Admin</option>
                        <option value="2">User</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-3 px-8 py-5">
                    <button
                      disabled={loading}
                      type="button"
                      onClick={handleClose}
                      className="rounded-xl w-full h-12 px-6 py-2 text-body font-semibold font-poppins text-[#FB2C36] hover:scale-105 border-[#FB2C36] border focus:outline-none cursor-pointer active:scale-95 transisi"
                    >
                      Batal
                    </button>
                    <button
                      disabled={loading || !roleId}
                      type="submit"
                      className="rounded-xl bg-primary w-full h-12 px-6 py-2 text-body font-semibold font-poppins text-cream-light shadow cursor-pointer hover:scale-105 hover:shadow-lg focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-400 active:scale-95 transisi flex items-center justify-center gap-3"
                    >
                      {loading && <Spinner />}
                      {loading ? 'Menyimpan data...' : 'Simpan Perubahan'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 z-10000 flex items-center justify-center bg-[#1e1e1e]/50 p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              className="mx-auto w-full max-w-sm bg-cream-light rounded-3xl p-8 flex flex-col gap-4 shadow-xl"
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-1">
                <h4 className="font-poppins font-bold text-title2 text-dark">
                  Tutup tanpa menyimpan?
                </h4>
                <p className="font-jakarta text-body text-cream-dark">
                  Perubahan hak akses user ini tidak akan diterapkan.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="w-full h-11 rounded-xl border border-primary text-primary font-poppins font-semibold text-body cursor-pointer hover:scale-105 active:scale-95 transisi"
                >
                  Kembali
                </button>
                <button
                  onClick={handleConfirmClose}
                  className="w-full h-11 rounded-xl bg-[#BA1A1A] text-white font-poppins font-semibold text-body cursor-pointer hover:bg-red-700 active:scale-95 transisi"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
