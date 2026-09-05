import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CarService } from '../../../core/services/car.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Car } from '../../../core/models/car.model';
import { ImageGalleryComponent } from '../../../components/image-gallery/image-gallery.component';
import { RatingComponent } from '../../../components/rating/rating.component';
import { SkeletonLoaderComponent } from '../../../components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-car-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ImageGalleryComponent,
    RatingComponent,
    SkeletonLoaderComponent,
  ],
  template: `
    <!-- Loading -->
    @if (isLoading()) {
      <div class="container mx-auto px-6 pt-32 py-12">
        <app-skeleton-loader type="image"></app-skeleton-loader>
      </div>
    }

    <!-- Car Not Found -->
    @if (!isLoading() && !car()) {
      <div class="container mx-auto px-6 pt-40 py-24 text-center">
        <div class="w-24 h-24 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-8">
          <i class="pi pi-search text-4xl text-muted-foreground"></i>
        </div>
        <h2 class="text-3xl font-bold mb-3 font-display">السيارة غير موجودة</h2>
        <p class="text-muted-foreground mb-8">لم يتم العثور على السيارة المطلوبة</p>
        <a routerLink="/cars" class="btn btn-primary px-8 py-3 rounded-xl">العودة للمعرض</a>
      </div>
    }

    <!-- Car Detail -->
    @if (!isLoading() && car()) {
      <div class="animate-fadeInUp font-body">

        <!-- ── Breadcrumb — sits BELOW the fixed header ────────────────── -->
        <div class="pt-20 border-b border-border/40 bg-background/80 backdrop-blur-xl">
          <div class="container mx-auto px-6 py-3 flex items-center gap-2 text-sm text-muted-foreground">
            <a routerLink="/" class="hover:text-foreground transition-colors flex items-center gap-1.5">
              <i class="pi pi-home text-xs"></i>
              الرئيسية
            </a>
            <i class="pi pi-angle-left text-xs opacity-40"></i>
            <a routerLink="/cars" class="hover:text-foreground transition-colors">السيارات</a>
            <i class="pi pi-angle-left text-xs opacity-40"></i>
            <span class="text-foreground font-semibold">{{ car()!.brand }} {{ car()!.model }}</span>
          </div>
        </div>

        <!-- ── Main Content ────────────────────────────────────────────── -->
        <div class="container mx-auto px-6 py-10">
          <div class="grid grid-cols-1 xl:grid-cols-5 gap-10">

            <!-- ── Left: Gallery + Description (3/5) ──────────────────── -->
            <div class="xl:col-span-3 space-y-6">
              <app-image-gallery [images]="car()!.images"></app-image-gallery>

              <!-- Description -->
              <div class="card p-6">
                <h3 class="text-base font-bold mb-4 text-foreground flex items-center gap-2">
                  <i class="pi pi-list text-primary"></i>
                  الوصف
                </h3>
                <p class="text-muted-foreground leading-relaxed text-base font-body">{{ car()!.description }}</p>
              </div>

              <!-- Reviews -->
              <div class="card p-6">
                <h2 class="text-xl font-bold mb-6 flex items-center gap-2 font-display">
                  <i class="pi pi-star-fill text-yellow-500"></i>
                  التقييمات والمراجعات
                </h2>
                <app-rating
                  [rating]="car()!.rating || 0"
                  [reviewCount]="car()!.reviews || 0"
                  [isEditing]="isEditingReview()"
                  (ratingSubmit)="submitReview($event)"
                  (editModeChange)="isEditingReview.set($event)">
                </app-rating>
              </div>
            </div>

            <!-- ── Right: Info Panel (2/5) ─────────────────────────────── -->
            <div class="xl:col-span-2 space-y-5">

              <!-- Title & Badges -->
              <div class="card p-6">
                <div class="flex items-center gap-2 mb-3">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                        [class.bg-primary/10]="car()!.condition === 'new'"
                        [class.text-primary]="car()!.condition === 'new'"
                        [class.border-primary/20]="car()!.condition === 'new'"
                        [class.bg-muted]="car()!.condition === 'used'"
                        [class.text-muted-foreground]="car()!.condition === 'used'"
                        [class.border-border]="car()!.condition === 'used'">
                    <i [class.pi-bolt]="car()!.condition === 'new'" [class.pi-refresh]="car()!.condition !== 'new'" class="pi text-xs"></i>
                    {{ car()!.condition === 'new' ? 'جديد' : 'مستعمل' }}
                  </span>
                  <span class="px-3 py-1 rounded-full text-xs font-bold bg-muted text-muted-foreground border border-border">
                    {{ car()!.year }}
                  </span>
                </div>

                <h1 class="text-3xl font-black mb-2 font-display text-foreground">{{ car()!.brand }} {{ car()!.model }}</h1>

                <!-- Rating -->
                @if (car()!.rating) {
                  <div class="flex items-center gap-2 text-sm mt-2">
                    <div class="flex gap-0.5">
                      @for (star of [1,2,3,4,5]; track star) {
                        <i [class.pi-star-fill]="star <= Math.round(car()!.rating!)"
                           [class.pi-star]="star > Math.round(car()!.rating!)"
                           class="pi text-yellow-500 text-xs"></i>
                      }
                    </div>
                    <span class="font-semibold text-foreground">{{ car()!.rating }}/5</span>
                    <span class="text-muted-foreground text-xs">({{ car()!.reviews }} تقييم)</span>
                  </div>
                }
              </div>

              <!-- Price -->
              <div class="card p-6">
                <p class="text-muted-foreground text-xs font-black uppercase tracking-widest mb-1">السعر</p>
                <p class="text-4xl font-black font-display text-foreground">{{ car()!.price | number }}
                  <span class="text-xl text-muted-foreground font-bold"> ر.س</span>
                </p>
              </div>

              <!-- Specs Grid -->
              <div class="card p-6">
                <h3 class="text-sm font-black mb-4 text-foreground uppercase tracking-widest flex items-center gap-2">
                  <i class="pi pi-cog text-primary"></i> المواصفات
                </h3>
                <div class="grid grid-cols-2 gap-3">

                  <div class="spec-item">
                    <i class="pi pi-map-marker spec-icon text-primary"></i>
                    <div>
                      <p class="spec-label">المسافة المقطوعة</p>
                      <p class="spec-value">{{ car()!.mileage | number }} كم</p>
                    </div>
                  </div>

                  <div class="spec-item">
                    <i class="pi pi-cog spec-icon text-primary"></i>
                    <div>
                      <p class="spec-label">ناقل الحركة</p>
                      <p class="spec-value">{{ car()!.transmission }}</p>
                    </div>
                  </div>

                  <div class="spec-item">
                    <i class="pi pi-gauge spec-icon text-primary"></i>
                    <div>
                      <p class="spec-label">نوع الوقود</p>
                      <p class="spec-value">{{ car()!.fuelType }}</p>
                    </div>
                  </div>

                  <div class="spec-item">
                    <i class="pi pi-wrench spec-icon text-primary"></i>
                    <div>
                      <p class="spec-label">حجم المحرك</p>
                      <p class="spec-value">{{ car()!.engineSize }}</p>
                    </div>
                  </div>

                  <div class="spec-item">
                    <i class="pi pi-palette spec-icon text-primary"></i>
                    <div>
                      <p class="spec-label">اللون</p>
                      <p class="spec-value">{{ car()!.color }}</p>
                    </div>
                  </div>

                  <div class="spec-item">
                    <i class="pi pi-calendar spec-icon text-primary"></i>
                    <div>
                      <p class="spec-label">سنة الصنع</p>
                      <p class="spec-value">{{ car()!.year }}</p>
                    </div>
                  </div>

                </div>
              </div>

              <!-- Action Buttons -->
              <div class="space-y-3">
                <button (click)="bookNow()"
                  class="btn btn-primary w-full py-4 rounded-xl text-base font-bold flex items-center justify-center gap-3 shadow-glow">
                  <i class="pi pi-calendar-plus text-lg"></i>
                  احجز الآن
                </button>

                <div class="grid grid-cols-2 gap-3">
                  <button (click)="contactSeller()"
                    class="btn btn-secondary py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
                    <i class="pi pi-phone"></i> تواصل معنا
                  </button>
                  <button (click)="toggleFavorite()"
                    class="btn btn-secondary py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                    [class.text-primary]="isFavorite()"
                    [class.border-primary]="isFavorite()">
                    <i [class.pi-heart-fill]="isFavorite()" [class.pi-heart]="!isFavorite()" class="pi text-lg"></i>
                    {{ isFavorite() ? 'في المفضلة' : 'إضافة للمفضلة' }}
                  </button>
                </div>

                <a [routerLink]="['/cars', car()!.id, 'edit']"
                  class="btn btn-secondary w-full py-3 rounded-xl text-center font-semibold flex items-center justify-center gap-2">
                  <i class="pi pi-pencil"></i> تعديل بيانات السيارة
                </a>
              </div>

            </div>
          </div>
        </div>

      </div>
    }
  `,
  styles: [`
    .spec-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 12px;
      border-radius: 10px;
      background: hsl(var(--muted) / 0.4);
      border: 1px solid hsl(var(--border) / 0.5);
    }
    .spec-icon {
      font-size: 16px;
      flex-shrink: 0;
      margin-top: 3px;
    }
    .spec-label {
      font-size: 10px;
      color: hsl(var(--muted-foreground));
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 3px;
    }
    .spec-value {
      font-size: 13px;
      font-weight: 800;
      color: hsl(var(--foreground));
    }
  `],
})
export class CarDetailComponent implements OnInit {
  car = signal<Car | undefined>(undefined);
  isLoading = signal(true);
  isEditingReview = signal(false);
  isFavorite = signal(false);
  Math = Math;

  constructor(
    private carService: CarService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.isLoading.set(true);
      setTimeout(() => {
        if (id) {
          const foundCar = this.carService.getCarById(id);
          this.car.set(foundCar);
          this.isFavorite.set(this.carService.isFavorite(id));
        }
        this.isLoading.set(false);
      }, 300);
    });
  }

  toggleFavorite(): void {
    if (this.car()) {
      this.carService.toggleFavorite(this.car()!.id);
      this.isFavorite.update(v => !v);
      this.notificationService.success(
        this.isFavorite() ? 'تمت الإضافة إلى المفضلة' : 'تمت الإزالة من المفضلة'
      );
    }
  }

  bookNow(): void {
    this.router.navigate(['/cars', this.car()!.id, 'book']);
  }

  contactSeller(): void {
    this.notificationService.info('سيتم إرسال بيانات التواصل إلى بريدك الإلكتروني');
  }

  submitReview(event: { rating: number; comment: string }): void {
    this.notificationService.success('شكراً على تقييمك!');
    this.isEditingReview.set(false);
  }
}
