import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../core/services/booking.service';
import { CarService } from '../../core/services/car.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="focused-page-container font-body">
      <div class="section-header mb-12">
        <h1 class="text-gradient">احجز رحلتك الآن</h1>
        <p>أكمل البيانات أدناه لتأكيد حجز سيارتك المفضلة</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start w-full">
        <!-- Car Summary -->
        @if (car()) {
          <div class="lg:col-span-4 sticky top-6">
            <div class="card p-8 border-glow">
              <div class="relative group mb-6 overflow-hidden rounded-[1.5rem]">
                <img [src]="car()!.images[0]" alt="Car" class="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-500" />
                <div class="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent"></div>
              </div>
              
              <h3 class="text-2xl font-black mb-1 text-foreground font-display">{{ car()!.brand }} {{ car()!.model }}</h3>
              <p class="text-muted-foreground font-black text-xs mb-6 uppercase tracking-widest">{{ car()!.year }} • {{ car()!.condition }}</p>
              
              <div class="bg-secondary/40 rounded-xl p-6 space-y-4 border border-border/50">
                <div class="flex justify-between items-center text-sm font-bold">
                  <span class="text-muted-foreground uppercase tracking-widest text-[10px]">السعر اليومي</span>
                  <span class="font-black text-foreground">{{ dailyRate() | number }} ر.س</span>
                </div>
                <div class="flex justify-between items-center text-sm font-bold">
                  <span class="text-muted-foreground uppercase tracking-widest text-[10px]">المدة</span>
                  <span class="font-black text-foreground">{{ numberOfDays() }} أيام</span>
                </div>
                <div class="pt-4 border-t border-border/50 flex justify-between items-end">
                  <span class="text-[10px] font-black text-muted-foreground uppercase tracking-widest pb-1">الإجمالي</span>
                  <span class="text-3xl font-black text-primary font-display">{{ totalPrice() | number }} ر.س</span>
                </div>
              </div>
            </div>
          </div>
        }

        <!-- Booking Form -->
        <div class="lg:col-span-8">
          <div class="card p-8 md:p-10 border-glow shadow-glow-lg">
            <h2 class="text-2xl font-black mb-10 text-foreground flex items-center gap-4 font-display">
              <span class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-black border border-primary/20">١</span>
              تفاصيل الحجز
            </h2>

            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-10">
              <!-- Dates Section -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-2">
                  <label class="text-xs font-bold text-muted-foreground uppercase tracking-widest mr-1">تاريخ الاستلام</label>
                  <input formControlName="startDate" type="date" class="w-full input" />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-bold text-muted-foreground uppercase tracking-widest mr-1">تاريخ الإرجاع</label>
                  <input formControlName="endDate" type="date" class="w-full input" />
                </div>
              </div>

              <div class="h-px bg-border/40 w-full"></div>

              <h2 class="text-2xl font-black mb-10 text-foreground flex items-center gap-4 font-display">
                <span class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-black border border-primary/20">٢</span>
                بيانات المستأجر
              </h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-2">
                  <label class="text-xs font-bold text-muted-foreground uppercase tracking-widest mr-1">الاسم الأول</label>
                  <input formControlName="firstName" type="text" class="w-full input" placeholder="محمد" />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-bold text-muted-foreground uppercase tracking-widest mr-1">اسم العائلة</label>
                  <input formControlName="lastName" type="text" class="w-full input" placeholder="أحمد" />
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-xs font-bold text-muted-foreground uppercase tracking-widest mr-1">رقم الجوال الفعال</label>
                <input formControlName="phone" type="tel" class="w-full input" placeholder="+966 50 000 0000" />
              </div>

              <div class="space-y-2">
                <label class="text-xs font-bold text-muted-foreground uppercase tracking-widest mr-1">ملاحظات إضافية</label>
                <textarea formControlName="specialRequests" rows="3" class="w-full input resize-none" placeholder="أي طلبات خاصة؟"></textarea>
              </div>

              <div class="pt-8">
                <button
                  type="submit"
                  [disabled]="!form.valid || isLoading()"
                  class="w-full btn btn-primary py-5 rounded-xl text-sm font-black uppercase tracking-[0.2em] shadow-glow"
                >
                  {{ isLoading() ? 'جاري المعالجة...' : 'تأكيد الحجز الآن' }}
                </button>
                <p class="text-center text-muted-foreground text-[10px] mt-6 font-bold uppercase tracking-widest">
                  دفع آمن ومدعوم بواسطة بوابة دفع Motors
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class BookingFormComponent implements OnInit {
  form: FormGroup;
  car = signal<any>(null);
  isLoading = signal(false);
  carId: string | null = null;

  dailyRate = signal(0);
  numberOfDays = signal(0);
  totalPrice = signal(0);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private carService: CarService,
    private bookingService: BookingService,
    private notificationService: NotificationService
  ) {
    this.form = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      specialRequests: [''],
      terms: [false, Validators.requiredTrue],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.carId = params['id'];
      if (this.carId) {
        const car = this.carService.getCarById(this.carId);
        if (car) {
          this.car.set(car);
          this.dailyRate.set(Math.ceil(car.price / 30));
        }
      }
    });

    this.form.get('startDate')?.valueChanges.subscribe(() => this.calculatePrice());
    this.form.get('endDate')?.valueChanges.subscribe(() => this.calculatePrice());
  }

  private calculatePrice(): void {
    const startDate = this.form.get('startDate')?.value;
    const endDate = this.form.get('endDate')?.value;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

      if (days > 0) {
        this.numberOfDays.set(days);
        this.totalPrice.set(this.dailyRate() * days);
      }
    }
  }

  async onSubmit(): Promise<void> {
    if (this.form.valid && this.carId) {
      this.isLoading.set(true);
      const booking = await this.bookingService.createBooking({
        carId: this.carId,
        userId: 'current-user',
        startDate: new Date(this.form.value.startDate),
        endDate: new Date(this.form.value.endDate),
        status: 'pending',
        totalPrice: this.totalPrice(),
      });

      if (booking) {
        this.notificationService.success('Booking confirmed! Check your email for details.');
        this.router.navigate(['/profile']);
      } else {
        this.notificationService.error('Failed to create booking');
      }
      this.isLoading.set(false);
    }
  }
}
