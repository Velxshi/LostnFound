import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/response";
import { timeAgo } from "@/lib/helper/time";
import { requireAuth } from "@/lib/helper/auth-helper";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuth(req);
    if (!auth.authorized || !auth.token) {
      return auth.response;
    }

    const userId = Number(auth.token.id);

    const { id } = await params;
    const itemId = Number(id);

    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: {
        status: true,
        category: true,
      },
    });

    if (!item) {
      return errorResponse("Item tidak ditemukan", 404);
    }

    const formatted = {
      id: item.id,
      isMe: item.userId === userId,
      image: item.category.linkImage,
      title: item.title,
      status: {
        id: item.status.id,
        name: item.status.name,
      },
      category: {
        id: item.category.id,
        name: item.category.name,
      },
      desc: item.desc,
      latitude: item.latitude,
      longitude: item.longitude,
      itemDetails: item.itemDetails,
      characteristics: item.characteristics,
      note: item.note,
      locationDetail: item.locationDetail,
      ditemukanPada: item.createdAt.toISOString().split("T")[0],
      diunggah: timeAgo(item.createdAt),
    };

    return successResponse({ data: formatted }, "Berhasil ambil detail item");
  } catch (error) {
    console.error(error);
    return errorResponse("Gagal ambil detail item");
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAuth(req)

    if (!auth.authorized || !auth.token) {
      return auth.response
    }

    const userId = Number(auth.token.id)

    const hasPermission = await prisma.userPermission.findFirst({
      where: {
        userId,
        permission: {
          name: 'action:delete_report',
        },
      },
    })

    if (!hasPermission) {
      return errorResponse(
        'Akses ditolak. Anda tidak memiliki izin untuk menghapus kategori.',
        403,
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
      },
    })

    if (!user || user.role.roleName !== 'ADMIN') {
      return errorResponse(
        'Hanya admin yang dapat menghapus item',
        403,
      )
    }

    const { id } = await params
    const itemId = Number(id)

    if (isNaN(itemId)) {
      return errorResponse('ID item tidak valid', 400)
    }

    const item = await prisma.item.findUnique({
      where: {
        id: itemId,
      },
    })

    if (!item) {
      return errorResponse(
        'Item tidak ditemukan',
        404,
      )
    }

    await prisma.item.delete({
      where: {
        id: itemId,
      },
    })

    return successResponse(
      null,
      'Item berhasil dihapus',
    )
  } catch (error) {
    console.error(error)
    return errorResponse(
      'Gagal menghapus item',
    )
  }
}
