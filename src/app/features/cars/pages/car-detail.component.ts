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
      <div class="container mx-auto px-6 py-12">
        <app-skeleton-loader type="image"></app-skeleton-loader>
      </div>
    }

    <!-- Car Not Found -->
    @if (!isLoading() && !car()) {
      <div class="container mx-auto px-6 py-24 text-center">
        <div class="text-8xl mb-6">🔍</div>
        <h2 class="text-3xl font-bold mb-3">السيارة غير موجودة</h2>
        <p class="text-slate-400 mb-8">لم يتم العثور على السيارة المطلوبة</p>
        <a routerLink="/cars" class="btn btn-primary px-8 py-3 rounded-xl">العودة للمعرض</a>
      </div>
    }

    <!-- Car Detail -->
    @if (!isLoading() && car()) {
      <div class="animate-fadeInUp">

        <!-- ── Breadcrumb ─────────────────────────────────────────── -->
        <div class="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-30">
          <div class="container mx-auto px-6 py-3 flex items-center gap-2 text-sm text-slate-400">
            <a routerLink="/" class="hover:text-white transition">الرئيسية</a>
            <span>/</span>
            <a routerLink="/cars" class="hover:text-white transition">السيارات</a>
            <span>/</span>
            <span class="text-white font-semibold">{{ car()!.brand }} {{ car()!.model }}</span>
          </div>
        </div>

        <div class="container mx-auto px-6 py-10">
          <div class="grid grid-cols-1 xl:grid-cols-5 gap-8">

            <!-- ── Left: Gallery (3/5) ─────────────────────────────── -->
            <div class="xl:col-span-3">
              <app-image-gallery [images]="car()!.images"></app-image-gallery>

              <!-- Description -->
              <div class="glass-effect rounded-2xl p-6 mt-6">
                <h3 class="text-xl font-bold mb-3 flex items-center gap-2">
                  <span class="text-blue-400">📋</span> الوصف
                </h3>
                <p class="text-slate-300 leading-relaxed text-base">{{ car()!.description }}</p>
              </div>
            </div>

            <!-- ── Right: Info (2/5) ───────────────────────────────── -->
            <div class="xl:col-span-2 space-y-5">

              <!-- Title & Badges -->
              <div>
                <div class="flex items-center gap-2 mb-3">
                  <span class="badge-cinematic px-3 py-1 rounded-full text-xs font-bold"
                        [class.text-green-400]="car()!.condition === 'new'"
                        [class.text-orange-400]="car()!.condition === 'used'">
                    <i [class.pi-bolt]="car()!.condition === 'new'" [class.pi-refresh]="car()!.condition !== 'new'" class="pi me-1"></i>{{ car()!.condition === 'new' ? 'جديد' : 'مستعمل' }}
                  </span>
                  <span class="badge-cinematic px-3 py-1 rounded-full text-xs text-slate-300">
                    {{ car()!.year }}
                  </span>
                </div>
                <h1 class="text-4xl font-black mb-2">{{ car()!.brand }} {{ car()!.model }}</h1>

                <!-- Rating -->
                @if (car()!.rating) {
                  <div class="flex items-center gap-2 text-sm">
                    <div class="flex text-yellow-400">
                      @for (star of [1,2,3,4,5]; track star) {
                        <i [class.pi-star-fill]="star <= Math.round(car()!.rating!)" [class.pi-star]="star > Math.round(car()!.rating!)" class="pi text-yellow-400 text-xs"></i>
                      }
                    </div>
                    <span class="font-semibold text-white">{{ car()!.rating }}/5</span>
                    <span class="text-slate-400">({{ car()!.reviews }} تقييم)</span>
                  </div>
                }
              </div>

              <!-- Price -->
              <div class="glass-effect rounded-2xl p-5">
                <p class="text-slate-400 text-sm mb-1">السعر</p>
                <p class="text-5xl font-black gradient-text">$ {{ car()!.price | number }}</p>
              </div>

              <!-- Specs Grid -->
              <div class="glass-effect rounded-2xl p-5">
                <h3 class="text-base font-bold mb-4 text-slate-300 flex items-center gap-2">
                  <i class="pi pi-cog text-blue-400"></i> المواصفات
                </h3>
                <div class="grid grid-cols-2 gap-3">

                  <div class="spec-item">
                    <i class="pi pi-map-marker spec-icon"></i>
                    <div>
                      <p class="spec-label">المسافة المقطوعة</p>
                      <p class="spec-value">{{ car()!.mileage | number }} km</p>
                    </div>
                  </div>

                  <div class="spec-item">
                    <i class="pi pi-cog spec-icon"></i>
                    <div>
                      <p class="spec-label">ناقل الحركة</p>
                      <p class="spec-value">{{ car()!.transmission }}</p>
                    </div>
                  </div>

                  <div class="spec-item">
                    <i class="pi pi-gauge spec-icon"></i>
                    <div>
                      <p class="spec-label">نوع الوقود</p>
                      <p class="spec-value">{{ car()!.fuelType }}</p>
                    </div>
                  </div>

                  <div class="spec-item">
                    <i class="pi pi-wrench spec-icon"></i>
                    <div>
                      <p class="spec-label">حجم المحرك</p>
                      <p class="spec-value">{{ car()!.engineSize }}</p>
                    </div>
                  </div>

                  <div class="spec-item">
                    <i class="pi pi-palette spec-icon"></i>
                    <div>
                      <p class="spec-label">اللون</p>
                      <p class="spec-value">{{ car()!.color }}</p>
                    </div>
                  </div>

                  <div class="spec-item">
                    <i class="pi pi-calendar spec-icon"></i>
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
                  class="btn btn-primary w-full py-4 rounded-xl text-lg font-bold">
                  <i class="pi pi-calendar-plus me-2"></i> احجز الآن
                </button>

                <div class="grid grid-cols-2 gap-3">
                  <button (click)="contactSeller()"
                    class="btn btn-secondary py-3 rounded-xl font-semibold">
                    <i class="pi pi-phone me-2"></i> تواصل معنا
                  </button>
                  <button (click)="toggleFavorite()"
                    class="btn btn-secondary py-3 rounded-xl font-semibold text-xl"
                    [class.text-red-400]="isFavorite()">
                    <i [class.pi-heart-fill]="isFavorite()" [class.pi-heart]="!isFavorite()" class="pi"></i>
                  </button>
                </div>

                <a [routerLink]="['/cars', car()!.id, 'edit']"
                  class="btn btn-secondary w-full py-3 rounded-xl text-center font-semibold block">
                  <i class="pi pi-pencil me-2"></i> تعديل بيانات السيارة
                </a>
              </div>

            </div>
          </div>

          <!-- ── Reviews ──────────────────────────────────────────────── -->
          <div class="mt-12 pt-10 border-t border-slate-700/50">
            <h2 class="text-2xl font-bold mb-6"><i class="pi pi-star-fill text-yellow-400 me-2"></i> التقييمات والمراجعات</h2>
            <app-rating
              [rating]="car()!.rating || 0"
              [reviewCount]="car()!.reviews || 0"
              [isEditing]="isEditingReview()"
              (ratingSubmit)="submitReview($event)"
              (editModeChange)="isEditingReview.set($event)">
            </app-rating>
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
      padding: 10px;
      border-radius: 10px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.06);
    }
    .spec-icon {
      font-size: 18px;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .spec-label {
      font-size: 11px;
      color: #94a3b8;
      font-weight: 500;
      margin-bottom: 2px;
    }
    .spec-value {
      font-size: 14px;
      font-weight: 700;
      color: #f1f5f9;
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
      // Small tick to allow mock data signal to settle
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
        this.isFavorite() ? 'تمت الإضافة إلى المفضلة ❤️' : 'تمت الإزالة من المفضلة'
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
    this.notificationService.success('شكراً على تقييمك! 🌟');
    this.isEditingReview.set(false);
  }
}
