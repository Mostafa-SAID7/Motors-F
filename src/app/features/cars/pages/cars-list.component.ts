import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CarService, FilterOptions, SortOptions } from '../../../core/services/car.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Car } from '../../../core/models/car.model';
import { SearchFilterComponent } from '../../../components/search-filter/search-filter.component';
import { CarCardComponent } from '../../../components/car-card/car-card.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { SkeletonLoaderComponent } from '../../../components/skeleton-loader/skeleton-loader.component';

type ViewMode = 'card' | 'table';

@Component({
  selector: 'app-cars-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    SearchFilterComponent,
    CarCardComponent,
    PaginationComponent,
    SkeletonLoaderComponent,
  ],
  template: `
    <div class="focused-page-container font-body">

      <!-- ── Page Header ───────────────────────────────────────────── -->
      <div class="flex flex-wrap items-end justify-between gap-6 mb-12 w-full">
        <div class="space-y-2">
          <h1 class="text-5xl font-black font-display text-gradient">معرض السيارات</h1>
          <p class="text-muted-foreground font-medium uppercase tracking-widest text-xs">
            {{ filteredCars().length | number }} سيارة متاحة في المعرض حالياً
            @if (isUsingInsForge()) {
              <span class="inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black mr-2 border border-primary/20">🔴 مباشر</span>
            }
          </p>
        </div>

        <div class="flex items-center gap-4">
          <!-- View Toggle -->
          <div class="flex items-center bg-secondary/50 rounded-xl p-1 border border-border/50">
            <button id="btn-card-view"
              (click)="setView('card')"
              class="w-10 h-10 flex items-center justify-center rounded-lg transition-all"
              [class.bg-primary]="viewMode() === 'card'"
              [class.text-white]="viewMode() === 'card'"
              [class.text-muted-foreground]="viewMode() !== 'card'"
              title="عرض البطاقات">
              ⊞
            </button>
            <button id="btn-table-view"
              (click)="setView('table')"
              class="w-10 h-10 flex items-center justify-center rounded-lg transition-all"
              [class.bg-primary]="viewMode() === 'table'"
              [class.text-white]="viewMode() === 'table'"
              [class.text-muted-foreground]="viewMode() !== 'table'"
              title="عرض الجدول">
              ☰
            </button>
          </div>

          <!-- Add Car -->
          <a id="btn-add-car" routerLink="/cars/add"
            class="btn btn-primary px-6 py-3 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-widest shadow-glow">
            <span>+ أضف سيارة</span>
          </a>
        </div>
      </div>

      <!-- ── Filters ────────────────────────────────────────────────── -->
      <div class="mb-12 w-full">
        <app-search-filter
          (searchChange)="onSearchChange($event)"
          (filterChange)="onFilterChange($event)"
          (sortChange)="onSortChange($event)">
        </app-search-filter>
      </div>

      <!-- ── Favorites Banner ───────────────────────────────────────── -->
      @if (showFavoritesOnly()) {
        <div class="mb-8 card p-6 border-primary/30 bg-primary/5 flex items-center justify-between w-full">
          <div class="flex items-center gap-4">
            <div class="text-3xl">❤️</div>
            <div>
              <p class="font-black text-foreground font-display">عرض المفضلة فقط</p>
              <p class="text-xs text-muted-foreground font-bold uppercase tracking-widest">{{ favoriteCount() }} سيارة في قائمتك المفضلة</p>
            </div>
          </div>
          <button (click)="toggleFavoritesOnly()"
            class="btn btn-secondary px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest border border-border">
            عرض الكل
          </button>
        </div>
      }

      <!-- ── Loading ────────────────────────────────────────────────── -->
      @if (isLoading()) {
        <div class="w-full">
          <app-skeleton-loader type="card" [count]="6"></app-skeleton-loader>
        </div>
      }

      <!-- ── Empty State ────────────────────────────────────────────── -->
      @if (!isLoading() && paginatedCars().length === 0) {
        <div class="card p-24 text-center w-full max-w-2xl mx-auto flex flex-col items-center">
          <div class="text-7xl mb-8 opacity-20">🔍</div>
          <h3 class="text-3xl font-black mb-2 font-display">لم يتم العثور على نتائج</h3>
          <p class="text-muted-foreground mb-10 font-medium">لم نجد أي سيارات تتطابق مع معايير البحث الحالية</p>
          <button (click)="resetFilters()"
            class="btn btn-primary px-10 py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-glow">
            إعادة تعيين الفلاتر
          </button>
        </div>
      }

      <!-- ═══════════════════════════════════════════════════════════ -->
      <!-- CARD VIEW                                                    -->
      <!-- ═══════════════════════════════════════════════════════════ -->
      @if (!isLoading() && paginatedCars().length > 0 && viewMode() === 'card') {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 w-full">
          @for (car of paginatedCars(); track car.id) {
            <app-car-card
              [car]="car"
              [isFavorite]="carService.isFavorite(car.id)"
              (favoriteToggle)="toggleFavorite($event)"
              (compareClick)="addToComparison($event)">
            </app-car-card>
          }
        </div>
      }

      <!-- ═══════════════════════════════════════════════════════════ -->
      <!-- TABLE VIEW                                                   -->
      <!-- ═══════════════════════════════════════════════════════════ -->
      @if (!isLoading() && paginatedCars().length > 0 && viewMode() === 'table') {
        <div class="card p-0 overflow-hidden mb-12 w-full">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-secondary/40 border-b border-border">
                  <th class="text-right px-8 py-5 text-xs font-black text-muted-foreground uppercase tracking-widest">السيارة</th>
                  <th class="text-center px-4 py-5 text-xs font-black text-muted-foreground uppercase tracking-widest hidden md:table-cell">السنة</th>
                  <th class="text-center px-4 py-5 text-xs font-black text-muted-foreground uppercase tracking-widest">السعر</th>
                  <th class="text-center px-4 py-5 text-xs font-black text-muted-foreground uppercase tracking-widest hidden lg:table-cell">الحالة</th>
                  <th class="text-center px-4 py-5 text-xs font-black text-muted-foreground uppercase tracking-widest hidden lg:table-cell">الوقود</th>
                  <th class="text-center px-4 py-5 text-xs font-black text-muted-foreground uppercase tracking-widest hidden xl:table-cell">المسافة</th>
                  <th class="text-center px-4 py-5 text-xs font-black text-muted-foreground uppercase tracking-widest hidden md:table-cell">التقييم</th>
                  <th class="text-center px-8 py-5 text-xs font-black text-muted-foreground uppercase tracking-widest">إجراءات</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border/50">
                @for (car of paginatedCars(); track car.id; let even = $even) {
                  <tr class="group hover:bg-primary/5 transition-colors">
                    <!-- Car Name + Image -->
                    <td class="px-8 py-5">
                      <div class="flex items-center gap-4">
                        <img [src]="car.images[0]"
                             [alt]="car.brand"
                             class="w-16 h-12 object-cover rounded-xl shadow-lg border border-border/10 flex-shrink-0" />
                        <div>
                          <p class="font-black text-foreground font-display">{{ car.brand }} {{ car.model }}</p>
                          <p class="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{{ car.color }}</p>
                        </div>
                      </div>
                    </td>

                    <td class="px-4 py-5 text-center text-muted-foreground font-bold hidden md:table-cell">{{ car.year }}</td>

                    <td class="px-4 py-5 text-center">
                      <span class="font-black text-primary font-display text-lg">{{ car.price | number }} ر.س</span>
                    </td>

                    <td class="px-4 py-5 text-center hidden lg:table-cell">
                      <span class="px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest"
                            [class.bg-primary/10]="car.condition === 'new'"
                            [class.text-primary]="car.condition === 'new'"
                            [class.bg-secondary]="car.condition === 'used'"
                            [class.text-muted-foreground]="car.condition === 'used'">
                        {{ car.condition === 'new' ? 'جديد' : 'مستعمل' }}
                      </span>
                    </td>

                    <td class="px-4 py-5 text-center text-muted-foreground font-black text-[10px] uppercase tracking-widest hidden lg:table-cell">{{ car.fuelType }}</td>

                    <td class="px-4 py-5 text-center text-muted-foreground font-bold hidden xl:table-cell">
                      {{ car.mileage | number }} كم
                    </td>

                    <td class="px-4 py-5 text-center hidden md:table-cell">
                      <div class="flex items-center justify-center gap-1.5 text-primary font-black">
                        <i class="pi pi-star-fill text-primary text-base"></i>
                        <span>{{ car.rating || '—' }}</span>
                      </div>
                    </td>

                    <td class="px-8 py-5">
                      <div class="flex items-center justify-center gap-3">
                        <a [routerLink]="['/cars', car.id]"
                          class="w-8 h-8 flex items-center justify-center rounded-lg bg-secondary text-foreground hover:bg-primary hover:text-white transition-all shadow-sm" title="عرض"><i class="pi pi-eye text-sm"></i></a>
                        <a [routerLink]="['/cars', car.id, 'edit']"
                          class="w-8 h-8 flex items-center justify-center rounded-lg bg-secondary text-foreground hover:bg-primary hover:text-white transition-all shadow-sm" title="تعديل"><i class="pi pi-pencil text-sm"></i></a>
                        <button (click)="toggleFavorite(car.id)"
                          class="w-8 h-8 flex items-center justify-center rounded-lg bg-secondary transition-all shadow-sm"
                          [class.text-primary]="carService.isFavorite(car.id)"
                          [class.text-muted-foreground]="!carService.isFavorite(car.id)"
                          title="مفضلة">
                          <i [class.pi-heart-fill]="carService.isFavorite(car.id)" [class.pi-heart]="!carService.isFavorite(car.id)" class="pi text-sm"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- ── Pagination ─────────────────────────────────────────────── -->
      <div class="w-full">
        @if (!isLoading() && filteredCars().length > itemsPerPage()) {
          <app-pagination
            [totalItems]="filteredCars().length"
            [itemsPerPage]="itemsPerPage()"
            [currentPage]="currentPage()"
            (pageChange)="onPageChange($event)"
            (itemsPerPageChange)="onItemsPerPageChange($event)">
          </app-pagination>
        }
      </div>

      <!-- ── Comparison Panel ───────────────────────────────────────── -->
      @if (comparisonList().length > 0) {
        <div class="mt-12 card p-10 w-full animate-fadeInUp">
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center gap-4">
              <div class="text-3xl">🔄</div>
              <h3 class="text-2xl font-black font-display">مقارنة السيارات ({{ comparisonList().length }})</h3>
            </div>
            <button (click)="clearComparison()"
              class="btn btn-secondary px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest border border-border">
              مسح الكل
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-border">
                  <th class="text-right py-4 px-6 text-xs font-black text-muted-foreground uppercase tracking-widest">الخاصية</th>
                  @for (carId of comparisonList(); track carId) {
                    @if (getCarById(carId); as car) {
                      <th class="text-center py-4 px-6 font-black font-display text-lg text-primary">{{ car.brand }} {{ car.model }}</th>
                    }
                  }
                </tr>
              </thead>
              <tbody class="divide-y divide-border/50">
                @for (row of comparisonRows; track row.key) {
                  <tr class="border-b border-slate-700/50">
                    <td class="py-3 px-4 font-semibold text-slate-400">{{ row.label }}</td>
                    @for (carId of comparisonList(); track carId) {
                      @if (getCarById(carId); as car) {
                        <td class="py-3 px-4 text-center text-white">{{ row.value(car) }}</td>
                      }
                    }
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

    </div>
  `,
  styles: [`
    .view-toggle-btn {
      @apply px-3 py-2 rounded-lg text-slate-400 font-bold text-lg transition-all duration-200;
    }
    .view-toggle-btn.active {
      @apply bg-blue-600 text-white;
    }
    .icon-btn {
      @apply text-lg cursor-pointer hover:scale-125 transition-transform duration-150;
    }
    .table-row-item {
      transition: background 0.15s ease;
    }
    .table-row-item:hover {
      background: rgba(59,130,246,0.06) !important;
    }
  `],
})
export class CarsListComponent implements OnInit {
  currentPage = signal(1);
  itemsPerPage = signal(9);
  showFavoritesOnly = signal(false);
  comparisonList = signal<string[]>([]);
  isLoading = signal(false);
  viewMode = signal<ViewMode>('card');

  filteredCars = computed(() => this.carService.filteredAndSortedCars());
  favoriteCount = computed(() => this.carService.favoritesList().length);

  paginatedCars = computed(() => {
    const filtered = this.showFavoritesOnly()
      ? this.carService.getFavorites()
      : this.filteredCars();
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    return filtered.slice(start, start + this.itemsPerPage());
  });

  // Comparison table row definitions
  comparisonRows: { key: string; label: string; value: (c: Car) => string }[] = [
    { key: 'price',        label: 'السعر',           value: c => `$${c.price.toLocaleString()}` },
    { key: 'year',         label: 'السنة',           value: c => String(c.year) },
    { key: 'mileage',      label: 'المسافة',         value: c => `${c.mileage.toLocaleString()} km` },
    { key: 'fuelType',     label: 'الوقود',          value: c => c.fuelType },
    { key: 'transmission', label: 'ناقل الحركة',    value: c => c.transmission },
    { key: 'engineSize',   label: 'حجم المحرك',     value: c => c.engineSize },
    { key: 'condition',    label: 'الحالة',          value: c => c.condition === 'new' ? 'جديد' : 'مستعمل' },
    { key: 'rating',       label: 'التقييم',         value: c => c.rating ? `${c.rating}/5` : '—' },
  ];

  constructor(
    public carService: CarService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.isLoading.set(true);
    setTimeout(() => this.isLoading.set(false), 500);
  }

  isUsingInsForge(): boolean {
    return this.carService.isUsingInsForge();
  }

  setView(mode: ViewMode): void {
    this.viewMode.set(mode);
  }

  onSearchChange(term: string): void {
    this.carService.search(term);
    this.currentPage.set(1);
  }

  onFilterChange(filters: FilterOptions): void {
    this.carService.setFilters(filters);
    this.currentPage.set(1);
  }

  onSortChange(sort: SortOptions): void {
    this.carService.setSortOptions(sort);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onItemsPerPageChange(items: number): void {
    this.itemsPerPage.set(items);
    this.currentPage.set(1);
  }

  toggleFavorite(carId: string): void {
    this.carService.toggleFavorite(carId);
    const isFav = this.carService.isFavorite(carId);
    this.notificationService.success(isFav ? '❤️ تمت الإضافة للمفضلة' : 'تمت الإزالة من المفضلة');
  }

  toggleFavoritesOnly(): void {
    this.showFavoritesOnly.update(v => !v);
    this.currentPage.set(1);
  }

  addToComparison(carId: string): void {
    const current = this.comparisonList();
    if (current.includes(carId)) {
      this.comparisonList.set(current.filter(id => id !== carId));
      this.notificationService.info('تمت الإزالة من المقارنة');
    } else if (current.length < 4) {
      this.comparisonList.set([...current, carId]);
      this.notificationService.success('تمت الإضافة للمقارنة ✅');
    } else {
      this.notificationService.warning('لا يمكن مقارنة أكثر من 4 سيارات');
    }
  }

  clearComparison(): void {
    this.comparisonList.set([]);
    this.notificationService.info('تم مسح المقارنة');
  }

  getCarById(id: string): Car | undefined {
    return this.carService.getCarById(id);
  }

  resetFilters(): void {
    this.carService.search('');
    this.carService.setFilters({});
    this.carService.setSortOptions({ field: 'price', direction: 'asc' });
    this.currentPage.set(1);
    this.showFavoritesOnly.set(false);
    this.notificationService.info('تم إعادة تعيين الفلاتر');
  }
}
