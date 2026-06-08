import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/response";
import { requireAuth } from "@/lib/helper/auth-helper";

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req);

    if (!auth.authorized) {
      return auth.response;
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: {
          select: {
            id: true,
            roleName: true,
          },
        },
      },
      orderBy: { id: "asc" },
    });

    return successResponse(
      {
        data: users,
      },
      "Berhasil ambil data user",
    );
  } catch (error) {
    console.error(error);
    return errorResponse("Gagal ambil kategori");
  }
}
