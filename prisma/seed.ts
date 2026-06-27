import {
  PrismaClient,
  BlogStatus,
  RoasteryVariant,
  UserRole,
} from "@prisma/client";
import { cafeMenu } from "../lib/cafe-menu";
import { accessories } from "../lib/accessories";
import { blogPosts } from "../lib/blog";
import { giftItems, limitedProducts } from "../lib/data";

const prisma = new PrismaClient();

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]/g, "")
    .slice(0, 64);
}

async function main() {
  console.log("🌱 Seeding Koubar database...");

  // await prisma.transaction.deleteMany();
  // await prisma.orderItem.deleteMany();
  // await prisma.order.deleteMany();
  // await prisma.blogPost.deleteMany();
  // await prisma.giftItem.deleteMany();
  // await prisma.accessory.deleteMany();
  // await prisma.roasteryProduct.deleteMany();
  // await prisma.cafeMenuItem.deleteMany();
  // await prisma.cafeCategory.deleteMany();
  // await prisma.phoneOtp.deleteMany();
  // await prisma.user.deleteMany();

  const adminPhone = process.env.ADMIN_PHONE ?? "09120000000";
  const admin = await prisma.user.create({
    data: {
      phone: adminPhone,
      name: "مدیر کوبار",
      address: "تهران",
      role: UserRole.ADMIN,
    },
  });

  const demoUsers = await Promise.all(
    [
      { phone: "09121234567", name: "سارا محمدی", address: "تهران، نیاوران" },
      { phone: "09129876543", name: "علی رضایی", address: "تهران، زعفرانیه" },
      { phone: "09131112233", name: "مریم کاظمی", address: "اصفهان" },
    ].map((u) =>
      prisma.user.create({
        data: { ...u, role: UserRole.USER },
      }),
    ),
  );

  for (const [ci, cat] of cafeMenu.entries()) {
    await prisma.cafeCategory.create({
      data: {
        id: cat.id,
        name: cat.name,
        sortOrder: ci,
        items: {
          create: cat.items.map((item, ii) => ({
            slug: item.id,
            name: item.name,
            description: item.description,
            longDescription: item.longDescription,
            image: item.image ?? "/images/hero.png",
            price: item.price,
            badge: item.badge,
            notes: item.notes ?? [],
            sortOrder: ii,
            active: true,
          })),
        },
      },
    });
  }

  const extraRoastery = [
    ...limitedProducts,
    {
      id: "decaf-colombia",
      title: "دانه دی کف کلمبیا ۱ کیلوگرمی",
      description: "کافئین کم با طعم شکلاتی و بادام.",
      price: 5_800_000,
      badge: "جدید",
      variant: "street" as const,
    },
  ];

  for (const [i, p] of extraRoastery.entries()) {
    await prisma.roasteryProduct.create({
      data: {
        slug: p.id,
        title: p.title,
        description: p.description,
        longDescription: p.description,
        image: "/images/hero.png",
        price: p.price,
        badge: "badge" in p ? p.badge : undefined,
        variant:
          p.variant === "kenya"
            ? RoasteryVariant.KENYA
            : p.variant === "street"
              ? RoasteryVariant.STREET
              : RoasteryVariant.AFRICAN,
        sortOrder: i,
        inStock: true,
        active: true,
      },
    });
  }

  for (const [i, a] of accessories.entries()) {
    await prisma.accessory.create({
      data: {
        slug: a.id,
        title: a.title,
        description: a.description,
        longDescription: a.longDescription,
        image: a.image,
        price: a.price,
        badge: a.badge,
        category: a.category,
        notes: a.notes ?? [],
        sortOrder: i,
        inStock: true,
        active: true,
      },
    });
  }

  for (const [i, g] of giftItems.entries()) {
    await prisma.giftItem.create({
      data: {
        title: g.title,
        description: g.description,
        image: g.image,
        linkHref: "/#gifts",
        sortOrder: i,
        active: true,
      },
    });
  }

  for (const [i, post] of blogPosts.entries()) {
    await prisma.blogPost.create({
      data: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        image: post.image,
        author: post.author,
        category: post.category,
        readMinutes: post.readMinutes,
        status: i === 2 ? BlogStatus.DRAFT : BlogStatus.PUBLISHED,
        blocks: post.blocks,
        publishedAt: new Date(Date.now() - i * 86400000 * 7),
      },
    });
  }

  const staffMembers = await Promise.all(
    [
      { name: "علی احمدی", role: "سرور" },
      { name: "مریم حسینی", role: "باریستا" },
      { name: "رضا کریمی", role: "سرور" },
    ].map((s) => prisma.staff.create({ data: s })),
  );

  const roastery = await prisma.roasteryProduct.findFirst();
  const cafeItem = await prisma.cafeMenuItem.findFirst();

  if (roastery && demoUsers[0]) {
    const order = await prisma.order.create({
      data: {
        orderNumber: "ORD-SEED001",
        userId: demoUsers[0].id,
        type: "SHOP",
        status: "DELIVERED",
        total: roastery.price,
        shippingName: demoUsers[0].name!,
        shippingPhone: demoUsers[0].phone,
        shippingAddress: demoUsers[0].address!,
        items: {
          create: [
            {
              source: "ROASTERY",
              catalogId: roastery.slug,
              title: roastery.title,
              image: roastery.image,
              price: roastery.price,
              quantity: 1,
            },
          ],
        },
      },
    });
    await prisma.transaction.create({
      data: {
        txNumber: "TX-SEED001",
        orderId: order.id,
        userId: demoUsers[0].id,
        amount: order.total,
        method: "ثبت دستی (بدون درگاه)",
        status: "PAID",
      },
    });
  }

  if (cafeItem && demoUsers[1]) {
    const order = await prisma.order.create({
      data: {
        orderNumber: "ORD-SEED002",
        userId: demoUsers[1].id,
        type: "CAFE",
        status: "PROCESSING",
        total: cafeItem.price * 2,
        shippingName: demoUsers[1].name!,
        shippingPhone: demoUsers[1].phone,
        shippingAddress: demoUsers[1].address!,
        items: {
          create: [
            {
              source: "CAFE",
              catalogId: cafeItem.slug,
              title: cafeItem.name,
              image: cafeItem.image,
              price: cafeItem.price,
              quantity: 2,
            },
          ],
        },
      },
    });
    await prisma.transaction.create({
      data: {
        txNumber: "TX-SEED002",
        orderId: order.id,
        userId: demoUsers[1].id,
        amount: order.total,
        method: "ثبت دستی (بدون درگاه)",
        status: "PAID",
      },
    });
  }

  if (cafeItem && demoUsers[2]) {
    const order = await prisma.order.create({
      data: {
        orderNumber: "ORD-SEED003",
        userId: demoUsers[2].id,
        type: "CAFE",
        status: "DELIVERED",
        total: cafeItem.price * 3,
        shippingName: demoUsers[2].name!,
        shippingPhone: demoUsers[2].phone,
        shippingAddress: demoUsers[2].address!,
        items: {
          create: [
            {
              source: "CAFE",
              catalogId: cafeItem.slug,
              title: cafeItem.name,
              image: cafeItem.image,
              price: cafeItem.price,
              quantity: 3,
            },
          ],
        },
      },
    });
    await prisma.transaction.create({
      data: {
        txNumber: "TX-SEED003",
        orderId: order.id,
        userId: demoUsers[2].id,
        amount: order.total,
        method: "ثبت دستی (بدون درگاه)",
        status: "PAID",
      },
    });
    await prisma.review.create({
      data: {
        orderId: order.id,
        userId: demoUsers[2].id,
        staffId: staffMembers[1]!.id,
        staffStars: 5,
        foodStars: 4,
        comment: "قهوه عالی بود و برخورد پرسنل بسیار محترمانه.",
      },
    });
  }

  if (roastery && demoUsers[1] && staffMembers[0]) {
    const deliveredShop = await prisma.order.create({
      data: {
        orderNumber: "ORD-SEED004",
        userId: demoUsers[1].id,
        type: "SHOP",
        status: "DELIVERED",
        total: roastery.price * 2,
        shippingName: demoUsers[1].name!,
        shippingPhone: demoUsers[1].phone,
        shippingAddress: demoUsers[1].address!,
        items: {
          create: [
            {
              source: "ROASTERY",
              catalogId: roastery.slug,
              title: roastery.title,
              image: roastery.image,
              price: roastery.price,
              quantity: 2,
            },
          ],
        },
      },
    });
    await prisma.transaction.create({
      data: {
        txNumber: "TX-SEED004",
        orderId: deliveredShop.id,
        userId: demoUsers[1].id,
        amount: deliveredShop.total,
        method: "ثبت دستی (بدون درگاه)",
        status: "PAID",
      },
    });
    await prisma.review.create({
      data: {
        orderId: deliveredShop.id,
        userId: demoUsers[1].id,
        staffId: staffMembers[0]!.id,
        staffStars: 4,
        foodStars: 5,
        comment: "بسته‌بندی مرتب و تحویل سریع.",
      },
    });
  }

  if (cafeItem && demoUsers[0] && staffMembers[2]) {
    const order = await prisma.order.create({
      data: {
        orderNumber: "ORD-SEED005",
        userId: demoUsers[0].id,
        type: "CAFE",
        status: "DELIVERED",
        total: cafeItem.price,
        shippingName: demoUsers[0].name!,
        shippingPhone: demoUsers[0].phone,
        shippingAddress: demoUsers[0].address!,
        items: {
          create: [
            {
              source: "CAFE",
              catalogId: cafeItem.slug,
              title: cafeItem.name,
              image: cafeItem.image,
              price: cafeItem.price,
              quantity: 1,
            },
          ],
        },
      },
    });
    await prisma.transaction.create({
      data: {
        txNumber: "TX-SEED005",
        orderId: order.id,
        userId: demoUsers[0].id,
        amount: order.total,
        method: "ثبت دستی (بدون درگاه)",
        status: "PAID",
      },
    });
    await prisma.review.create({
      data: {
        orderId: order.id,
        userId: demoUsers[0].id,
        staffId: staffMembers[2]!.id,
        staffStars: 5,
        foodStars: 5,
        comment: "فضای کافه دلنشین و سرویس فوق‌العاده.",
        createdAt: new Date(Date.now() - 86400000),
      },
    });
  }

  console.log(`✅ Seed complete. Admin phone: ${adminPhone}`);
  console.log(`   Admin user id: ${admin.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
