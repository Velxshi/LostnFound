export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/response";
import { timeAgo } from "@/lib/helper/time";
import { requireAuth } from "@/lib/helper/auth-helper";

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req);

    if (!auth.authorized || !auth.token) {
      return auth.response;
    }

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;

    const userId = Number(auth.token.id);

    const sort = searchParams.get("sort") || "terbaru";
    const statusId = searchParams.get("statusId");
    const categoryId = searchParams.get("categoryId");
    const search = searchParams.get("search")?.trim();
    const type = searchParams.get("type");

    const where: any = {};

    if (type === "me") {
      where.userId = Number(auth.token.id);
    }

    if (statusId) {
      where.statusId = Number(statusId);
    }

    if (categoryId) {
      where.categoryId = Number(categoryId);
    }

    if (search) {
      where.title = {
        contains: search,
        mode: "insensitive",
      };
    }

    const orderBy = sort === "terlama" ? { createdAt: "asc" as const } : { createdAt: "desc" as const };

    const totalItems = await prisma.item.count({ where });

    const items = await prisma.item.findMany({
      where,
      include: {
        status: true,
        category: true,
      },
      orderBy,
      skip,
      take: limit,
    });

    const formatted = items.map((item) => ({
      id: item.id,
      title: item.title,
      image: item.category.linkImage,
      lat: item.latitude,
      lng: item.longitude,
      status: {
        id: item.status.id,
        name: item.status.name,
      },
      category: {
        id: item.category.id,
        name: item.category.name,
      },
      isMe: item.userId === userId,
      time: timeAgo(item.createdAt),
    }));

    return successResponse(
      {
        data: formatted,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalItems / limit),
          totalItems,
          perPage: limit,
        },
      },
      "Berhasil ambil data items",
    );
  } catch (error) {
    console.error(error);
    return errorResponse("Gagal ambil data items");
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req)

    if (!auth.authorized || !auth.token) {
      return auth.response
    }

    const userId = Number(auth.token.id)
    const body = await req.json()

    const title = body.title?.trim()
    const desc = body.desc?.trim()

    if (!title) {
      return errorResponse('Judul barang wajib diisi', 400)
    }

    if (title.length < 3) {
      return errorResponse(
        'Judul barang minimal 3 karakter',
        400,
      )
    }

    if (title.length > 100) {
      return errorResponse(
        'Judul barang maksimal 100 karakter',
        400,
      )
    }

    if (!body.categoryId) {
      return errorResponse(
        'Kategori wajib dipilih',
        400,
      )
    }

    if (!desc) {
      return errorResponse(
        'Deskripsi barang wajib diisi',
        400,
      )
    }

    if (desc.length < 10) {
      return errorResponse(
        'Deskripsi minimal 10 karakter',
        400,
      )
    }

    if (!body.statusId) {
      return errorResponse(
        'Status wajib dipilih',
        400,
      )
    }

    if (!body.tanggal) {
      return errorResponse(
        'Tanggal kejadian wajib diisi',
        400,
      )
    }

    const reportDate = new Date(body.tanggal)

    if (isNaN(reportDate.getTime())) {
      return errorResponse(
        'Format tanggal tidak valid',
        400,
      )
    }

    const latitude =
      body.latitude !== undefined
        ? Number(body.latitude)
        : null

    const longitude =
      body.longitude !== undefined
        ? Number(body.longitude)
        : null

    if (latitude !== null && longitude !== null) {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
        {
          headers: {
            'User-Agent': 'LostnFound/1.0',
          },
        },
      )

      const location = await response.json()

      const address = location.address || {}

      const isWaterArea =
        address.ocean ||
        address.sea ||
        address.water ||
        address.bay ||
        address.strait

      if (isWaterArea) {
        return errorResponse(
          'Lokasi tidak boleh berada di area perairan',
          400,
        )
      }
    }

    const item = await prisma.item.create({
      data: {
        title,
        categoryId: Number(body.categoryId),
        desc,
        statusId: Number(body.statusId),
        userId,
        createdAt: reportDate,

        note: body.note?.trim() || null,
        locationDetail:
          body.locationDetail?.trim() || null,

        latitude,
        longitude,

        itemDetails:
          body.itemDetails?.trim() || null,

        characteristics:
          body.characteristics?.trim() || null,
      },
    })

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        roleId: true,
      },
    })

    return successResponse(
      {
        id: item.id,
        roleId: user?.roleId,
      },
      'Berhasil laporkan item',
    )
  } catch (error) {
    console.error(error)
    return errorResponse(
      'Gagal laporkan item',
    )
  }
}
