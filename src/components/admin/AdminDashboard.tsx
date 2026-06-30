import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Boxes,
  CalendarClock,
  CheckCircle2,
  Clock3,
  CreditCard,
  ExternalLink,
  Layers3,
  Package,
  Plus,
  RefreshCcw,
  ShoppingCart,
  Sparkles,
  Tag,
  Truck,
  XCircle,
} from "lucide-react";

import AdminLayout from "./AdminLayout";
import {
  categoryApi,
  orderApi,
  productApi,
  STATUS_CONFIG,
  STATUS_OPTIONS,
  type AdminCategory,
  type AdminOrder,
  type AdminProduct,
} from "../../lib/adminService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const ORDER_STATUS_META: Record<
  string,
  { icon: typeof Clock3; badge: "default" | "secondary" | "destructive" | "outline" }
> = {
  PENDING: { icon: Clock3, badge: "outline" },
  PAID: { icon: CreditCard, badge: "secondary" },
  SHIPPED: { icon: Truck, badge: "secondary" },
  COMPLETED: { icon: CheckCircle2, badge: "default" },
  CANCELLED: { icon: XCircle, badge: "destructive" },
};

const numberFormat = new Intl.NumberFormat("id-ID");
const currencyFormat = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});
const dateFormat = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

type DashboardData = {
  products: AdminProduct[];
  categories: AdminCategory[];
  orders: AdminOrder[];
};

function toNumber(value: number | string | null | undefined) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value: number) {
  return currencyFormat.format(value).replace(/\s/g, " ");
}

function getCustomerName(order: AdminOrder) {
  return order.user?.name || order.user?.email || "Customer";
}

function getStatusLabel(status: string) {
  return STATUS_CONFIG[status]?.label || status;
}

function getPrimaryImage(product: AdminProduct) {
  return (
    product.imageUrl ||
    product.images?.find((image) => image.isPrimary)?.imageUrl ||
    product.images?.[0]?.imageUrl ||
    ""
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="h-4 w-24 rounded-md bg-muted" />
              <div className="h-8 w-28 rounded-md bg-muted" />
            </CardHeader>
            <CardContent>
              <div className="h-3 w-full rounded-md bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="h-5 w-36 rounded-md bg-muted" />
              <div className="h-4 w-56 rounded-md bg-muted" />
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {Array.from({ length: 4 }).map((_, itemIndex) => (
                <div key={itemIndex} className="h-12 rounded-md bg-muted" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData>({
    products: [],
    categories: [],
    orders: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError("");

    try {
      const [products, categories, orders] = await Promise.all([
        productApi.getAll(),
        categoryApi.getAll(),
        orderApi.getAll(),
      ]);

      setData({
        products: products.data,
        categories: categories.data,
        orders: orders.data,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const insights = useMemo(() => {
    const activeOrders = data.orders.filter((order) => order.status !== "CANCELLED");
    const paidRevenue = data.orders
      .filter((order) => ["PAID", "SHIPPED", "COMPLETED"].includes(order.status))
      .reduce((sum, order) => sum + toNumber(order.totalAmount), 0);
    const pendingRevenue = data.orders
      .filter((order) => order.status === "PENDING")
      .reduce((sum, order) => sum + toNumber(order.totalAmount), 0);
    const inventoryValue = data.products.reduce(
      (sum, product) => sum + toNumber(product.price) * product.stockQuantity,
      0,
    );
    const totalStock = data.products.reduce(
      (sum, product) => sum + product.stockQuantity,
      0,
    );
    const lowStockProducts = data.products
      .filter((product) => product.stockQuantity <= 5)
      .sort((a, b) => a.stockQuantity - b.stockQuantity)
      .slice(0, 5);
    const newProducts = data.products.filter((product) => product.isNew).length;
    const averageOrderValue = activeOrders.length
      ? paidRevenue / activeOrders.length
      : 0;
    const statusCounts = STATUS_OPTIONS.map((status) => ({
      status,
      count: data.orders.filter((order) => order.status === status).length,
      total: data.orders
        .filter((order) => order.status === status)
        .reduce((sum, order) => sum + toNumber(order.totalAmount), 0),
    }));
    const recentOrders = [...data.orders]
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
      .slice(0, 6);
    const topCategories = [...data.categories]
      .sort((a, b) => (b._count?.products ?? 0) - (a._count?.products ?? 0))
      .slice(0, 5);

    return {
      activeOrders,
      paidRevenue,
      pendingRevenue,
      inventoryValue,
      totalStock,
      lowStockProducts,
      newProducts,
      averageOrderValue,
      statusCounts,
      recentOrders,
      topCategories,
    };
  }, [data]);

  const statCards = [
    {
      label: "Revenue terkonfirmasi",
      value: formatCurrency(insights.paidRevenue),
      description: `${numberFormat.format(insights.activeOrders.length)} order aktif`,
      icon: BadgeCheck,
    },
    {
      label: "Menunggu pembayaran",
      value: formatCurrency(insights.pendingRevenue),
      description: `${insights.statusCounts.find((item) => item.status === "PENDING")?.count ?? 0} order pending`,
      icon: CalendarClock,
    },
    {
      label: "Produk tersedia",
      value: numberFormat.format(data.products.length),
      description: `${numberFormat.format(insights.totalStock)} unit stok`,
      icon: Package,
    },
    {
      label: "Nilai inventori",
      value: formatCurrency(insights.inventoryValue),
      description: `${numberFormat.format(insights.newProducts)} produk baru`,
      icon: Boxes,
    },
  ];

  const maxStatusCount = Math.max(
    1,
    ...insights.statusCounts.map((item) => item.count),
  );

  return (
    <AdminLayout>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                <Sparkles />
                Admin
              </Badge>
              <span className="text-sm text-muted-foreground">BlockNest operations</span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Pantau produk, kategori, stok, dan status pesanan dari backend Express.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link to="/">
                <ExternalLink data-icon="inline-start" />
                Lihat toko
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => loadDashboard(true)}
              disabled={loading || refreshing}
            >
              <RefreshCcw data-icon="inline-start" />
              {refreshing ? "Memuat" : "Refresh"}
            </Button>
            <Button asChild>
              <Link to="/admin/products/new">
                <Plus data-icon="inline-start" />
                Produk
              </Link>
            </Button>
          </div>
        </div>

        {error && (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="flex items-center gap-3 py-4 text-sm text-destructive">
              <AlertTriangle />
              {error}
            </CardContent>
          </Card>
        )}

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {statCards.map(({ label, value, description, icon: Icon }) => (
                <Card key={label}>
                  <CardHeader className="flex-row items-start justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <CardDescription>{label}</CardDescription>
                      <CardTitle className="text-2xl">{value}</CardTitle>
                    </div>
                    <div className="flex size-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                      <Icon />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
              <Card>
                <CardHeader className="flex-row items-start justify-between gap-4">
                  <div>
                    <CardTitle>Pesanan terbaru</CardTitle>
                    <CardDescription>
                      6 transaksi terakhir dari endpoint admin orders.
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/admin/orders">
                      Semua
                      <ArrowRight data-icon="inline-end" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {insights.recentOrders.length === 0 ? (
                    <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-md border border-dashed text-center">
                      <ShoppingCart />
                      <p className="text-sm font-medium">Belum ada pesanan</p>
                      <p className="text-xs text-muted-foreground">
                        Pesanan baru akan muncul di sini.
                      </p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="hidden md:table-cell">Tanggal</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {insights.recentOrders.map((order) => {
                          const meta = ORDER_STATUS_META[order.status] ?? ORDER_STATUS_META.PENDING;
                          const StatusIcon = meta.icon;

                          return (
                            <TableRow key={order.id}>
                              <TableCell>
                                <div className="flex flex-col gap-1">
                                  <span className="font-medium">{getCustomerName(order)}</span>
                                  <span className="font-mono text-xs text-muted-foreground">
                                    #{order.id.slice(0, 8).toUpperCase()}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={meta.badge}>
                                  <StatusIcon />
                                  {getStatusLabel(order.status)}
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden text-muted-foreground md:table-cell">
                                {dateFormat.format(new Date(order.createdAt))}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {formatCurrency(toNumber(order.totalAmount))}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Funnel status</CardTitle>
                  <CardDescription>
                    Distribusi status sesuai enum Prisma OrderStatus.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {insights.statusCounts.map(({ status, count, total }) => {
                    const meta = ORDER_STATUS_META[status] ?? ORDER_STATUS_META.PENDING;
                    const StatusIcon = meta.icon;

                    return (
                      <div key={status} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <StatusIcon />
                            <span className="text-sm font-medium">
                              {getStatusLabel(status)}
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {numberFormat.format(count)}
                          </span>
                        </div>
                        <Progress value={(count / maxStatusCount) * 100} />
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(total)}
                        </p>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader className="flex-row items-start justify-between gap-4">
                  <div>
                    <CardTitle>Stok butuh perhatian</CardTitle>
                    <CardDescription>
                      Produk dengan stok 5 unit atau kurang.
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/admin/products">
                      Produk
                      <ArrowRight data-icon="inline-end" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {insights.lowStockProducts.length === 0 ? (
                    <div className="flex min-h-32 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                      Tidak ada stok rendah.
                    </div>
                  ) : (
                    insights.lowStockProducts.map((product) => {
                      const image = getPrimaryImage(product);

                      return (
                        <div
                          key={product.id}
                          className="flex items-center justify-between gap-4 rounded-md border p-3"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-secondary">
                              {image ? (
                                <img
                                  src={image}
                                  alt={product.imageAlt || product.name}
                                  className="size-full object-cover"
                                />
                              ) : (
                                <Package />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">{product.name}</p>
                              <p className="truncate text-xs text-muted-foreground">
                                {product.category || product.slug}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant={product.stockQuantity <= 0 ? "destructive" : "outline"}
                            className={cn(product.stockQuantity > 0 && "border-amber-300")}
                          >
                            {product.stockQuantity} unit
                          </Badge>
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ringkasan katalog</CardTitle>
                  <CardDescription>
                    Kategori dan performa inventori saat ini.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-md border p-3">
                      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                        <Tag />
                        <span className="text-xs">Kategori</span>
                      </div>
                      <p className="text-2xl font-semibold">
                        {numberFormat.format(data.categories.length)}
                      </p>
                    </div>
                    <div className="rounded-md border p-3">
                      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                        <Layers3 />
                        <span className="text-xs">AOV</span>
                      </div>
                      <p className="text-lg font-semibold">
                        {formatCurrency(insights.averageOrderValue)}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex flex-col gap-3">
                    {insights.topCategories.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Belum ada kategori.
                      </p>
                    ) : (
                      insights.topCategories.map((category) => (
                        <div
                          key={category.id}
                          className="flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {category.label}
                            </p>
                            <p className="truncate font-mono text-xs text-muted-foreground">
                              {category.slug}
                            </p>
                          </div>
                          <Badge variant="secondary">
                            {category._count?.products ?? 0} produk
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Button className="h-auto justify-start p-4" asChild>
                <Link to="/admin/products/new">
                  <Package data-icon="inline-start" />
                  <span className="flex flex-col items-start">
                    <span>Tambah produk</span>
                    <span className="text-xs font-normal opacity-70">
                      Buat item katalog baru
                    </span>
                  </span>
                </Link>
              </Button>
              <Button className="h-auto justify-start p-4" variant="outline" asChild>
                <Link to="/admin/categories/new">
                  <Tag data-icon="inline-start" />
                  <span className="flex flex-col items-start">
                    <span>Tambah kategori</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      Kelola grouping produk
                    </span>
                  </span>
                </Link>
              </Button>
              <Button className="h-auto justify-start p-4" variant="outline" asChild>
                <Link to="/admin/orders">
                  <ShoppingCart data-icon="inline-start" />
                  <span className="flex flex-col items-start">
                    <span>Kelola pesanan</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      Update status transaksi
                    </span>
                  </span>
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
