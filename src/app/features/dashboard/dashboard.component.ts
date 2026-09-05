import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarService } from '../../core/services/car.service';
import { Car } from '../../core/models/car.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-page font-body">

      <!-- ── Hero Banner ──────────────────────────────────────────────── -->
      <section class="relative overflow-hidden pt-40 pb-28">
        <div class="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <div class="animate-fadeInUp max-w-4xl">
            <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black bg-primary/10 text-primary mb-8 tracking-[0.2em] uppercase border border-primary/20">
              <i class="pi pi-car text-sm"></i>
              أفضل عروض السيارات في المملكة
            </span>
            <h1 class="text-6xl lg:text-8xl font-black mb-8 leading-[1.1] font-display">
              اكتشف سيارة
              <span class="text-gradient block mt-2">أحلامك اليوم</span>
            </h1>
            <p class="text-xl text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
              نقدم لك مجموعة مختارة من أفخم السيارات وأكثرها اعتمادية، مع ضمان كامل وتسهيلات في السداد.
            </p>
            <div class="flex flex-wrap gap-6 justify-center">
              <a routerLink="/cars"
                class="btn btn-primary text-sm px-10 py-4 rounded-xl flex items-center gap-3 tracking-widest">
                <span>تصفح المعرض</span>
                <i class="pi pi-arrow-left"></i>
              </a>
              <a routerLink="/cars/add"
                class="btn btn-secondary text-sm px-10 py-4 rounded-xl tracking-widest font-black border border-border flex items-center gap-3">
                <i class="pi pi-plus"></i>
                أضف سيارة للبيع
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Stats Cards ───────────────────────────────────────────────── -->
      <section class="container mx-auto px-6 mb-24 relative z-20">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">

          <div class="card p-8 text-center animate-fadeInUp group hover:border-primary/30">
            <div class="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <i class="pi pi-car text-2xl"></i>
            </div>
            <p class="text-4xl font-black text-foreground mb-1 font-display">{{ totalCars() }}</p>
            <p class="text-xs text-muted-foreground font-black uppercase tracking-widest">إجمالي السيارات</p>
          </div>

          <div class="card p-8 text-center animate-fadeInUp group hover:border-primary/30" style="animation-delay:0.1s">
            <div class="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <i class="pi pi-bolt text-2xl"></i>
            </div>
            <p class="text-4xl font-black text-foreground mb-1 font-display">{{ newCars() }}</p>
            <p class="text-xs text-muted-foreground font-black uppercase tracking-widest">سيارات جديدة</p>
          </div>

          <div class="card p-8 text-center animate-fadeInUp group hover:border-primary/30" style="animation-delay:0.2s">
            <div class="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <i class="pi pi-refresh text-2xl"></i>
            </div>
            <p class="text-4xl font-black text-foreground mb-1 font-display">{{ usedCars() }}</p>
            <p class="text-xs text-muted-foreground font-black uppercase tracking-widest">سيارات مستعملة</p>
          </div>

          <div class="card p-8 text-center animate-fadeInUp group hover:border-primary/30" style="animation-delay:0.3s">
            <div class="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <i class="pi pi-star-fill text-2xl"></i>
            </div>
            <p class="text-4xl font-black text-foreground mb-1 font-display">{{ avgRating() }}</p>
            <p class="text-xs text-muted-foreground font-black uppercase tracking-widest">متوسط التقييم</p>
          </div>

        </div>
      </section>

      <!-- ── Featured Cars ──────────────────────────────────────────────── -->
      <section class="container mx-auto px-6 mb-24">
        <div class="flex items-end justify-between mb-12">
          <div class="space-y-2">
            <h2 class="text-4xl font-black font-display">سيارات مميزة</h2>
            <p class="text-muted-foreground font-medium uppercase tracking-widest text-xs">الأعلى تقييماً والأكثر طلباً في معرضنا</p>
          </div>
          <a routerLink="/cars" class="btn btn-secondary px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest border border-border flex items-center gap-2">
            <span>عرض الكل</span>
            <i class="pi pi-arrow-left text-xs"></i>
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (car of featuredCars(); track car.id) {
            <a [routerLink]="['/cars', car.id]" class="card p-0 overflow-hidden hover:-translate-y-2 group">
              <!-- Image -->
              <div class="relative h-64 overflow-hidden">
                <img [src]="car.images[0]"
                     [alt]="car.brand + ' ' + car.model"
                     class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                     loading="lazy" />
                <div class="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent"></div>
                <!-- Badge -->
                <span class="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                      [class.bg-primary]="car.condition === 'new'"
                      [class.text-white]="car.condition === 'new'"
                      [class.bg-secondary]="car.condition === 'used'"
                      [class.text-foreground]="car.condition === 'used'">
                  {{ car.condition === 'new' ? 'جديد' : 'مستعمل' }}
                </span>
                <!-- Price -->
                <div class="absolute bottom-4 left-6 text-2xl font-black text-foreground font-display">{{ car.price | number }} ر.س</div>
              </div>

              <!-- Info -->
              <div class="p-6">
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <h3 class="text-lg font-black font-display mb-1">{{ car.brand }} {{ car.model }}</h3>
                    <p class="text-muted-foreground text-xs font-bold">{{ car.year }} • {{ car.color }}</p>
                  </div>
                  <div class="flex items-center gap-1.5 text-primary text-sm font-black">
                    <i class="pi pi-star-fill text-base"></i>
                    <span>{{ car.rating }}</span>
                  </div>
                </div>

                <div class="flex gap-4 text-[10px] font-black text-muted-foreground border-t border-border/50 pt-4 uppercase tracking-[0.1em]">
                  <span class="flex items-center gap-1.5">
                    <i class="pi pi-gauge text-sm opacity-60"></i> {{ car.fuelType }}
                  </span>
                  <span class="flex items-center gap-1.5">
                    <i class="pi pi-cog text-sm opacity-60"></i> {{ car.transmission }}
                  </span>
                  <span class="flex items-center gap-1.5">
                    <i class="pi pi-map-marker text-sm opacity-60"></i> {{ car.mileage | number }} كم
                  </span>
                </div>
              </div>
            </a>
          }
        </div>
      </section>

      <!-- ── CTA Banner ─────────────────────────────────────────────────── -->
      <section class="container mx-auto px-6 mb-32">
        <div class="card p-16 text-center border-glow relative overflow-hidden group">
          <div class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative z-10">
            <i class="pi pi-tag text-5xl text-primary mb-6 block"></i>
            <h2 class="text-4xl font-black mb-4 font-display">هل تريد بيع سيارتك؟</h2>
            <p class="text-muted-foreground mb-10 text-lg font-medium max-w-xl mx-auto">انضم إلى آلاف البائعين الناجحين في معرضنا واحصل على أفضل سعر لسيارتك اليوم</p>
            <a routerLink="/cars/add"
              class="btn btn-primary text-sm px-12 py-5 rounded-xl inline-flex items-center gap-3 tracking-[0.2em] uppercase shadow-glow">
              <i class="pi pi-plus"></i>
              أضف سيارتك مجاناً
            </a>
          </div>
        </div>
      </section>

    </div>
  `,
  styles: [],
})
export class DashboardComponent implements OnInit {
  private carService = inject(CarService);

  allCars = signal<Car[]>([]);

  totalCars = computed(() => this.allCars().length);
  newCars = computed(() => this.allCars().filter(c => c.condition === 'new').length);
  usedCars = computed(() => this.allCars().filter(c => c.condition === 'used').length);
  avgRating = computed(() => {
    const cars = this.allCars().filter(c => c.rating);
    if (!cars.length) return '0.0';
    return (cars.reduce((sum, c) => sum + (c.rating || 0), 0) / cars.length).toFixed(1);
  });

  featuredCars = computed(() =>
    [...this.allCars()]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 6)
  );

  topBrands = computed(() => {
    const brandMap = new Map<string, number>();
    this.allCars().forEach(c => brandMap.set(c.brand, (brandMap.get(c.brand) || 0) + 1));
    return Array.from(brandMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  });

  ngOnInit(): void {
    this.carService.getCars().subscribe(cars => this.allCars.set(cars));
  }
}
