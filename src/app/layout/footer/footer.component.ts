import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="mt-auto w-full font-body border-t border-border/30 bg-background">

      <!-- ── Main Footer Grid ─────────────────────────────────────────── -->
      <div class="container mx-auto px-6 py-16">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          <!-- Brand Column -->
          <div class="lg:col-span-1">
            <div class="text-2xl font-black text-gradient font-display tracking-tighter mb-4">MOTORS</div>
            <p class="text-muted-foreground text-sm leading-relaxed mb-6">
              منصتك المتكاملة لتصفح وشراء وبيع السيارات في المملكة العربية السعودية. أفضل الأسعار، أعلى الجودة، وتسهيلات في السداد.
            </p>
            <!-- Social Icons -->
            <div class="flex gap-3">
              <a href="#" aria-label="تويتر" class="w-9 h-9 rounded-xl bg-muted border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                <i class="pi pi-twitter text-sm"></i>
              </a>
              <a href="#" aria-label="انستغرام" class="w-9 h-9 rounded-xl bg-muted border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                <i class="pi pi-instagram text-sm"></i>
              </a>
              <a href="#" aria-label="يوتيوب" class="w-9 h-9 rounded-xl bg-muted border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                <i class="pi pi-youtube text-sm"></i>
              </a>
              <a href="#" aria-label="واتساب" class="w-9 h-9 rounded-xl bg-muted border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                <i class="pi pi-whatsapp text-sm"></i>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h4 class="text-xs font-black uppercase tracking-widest text-foreground mb-5 flex items-center gap-2">
              <i class="pi pi-link text-primary text-xs"></i>
              روابط سريعة
            </h4>
            <ul class="space-y-3">
              <li><a routerLink="/" class="footer-link">الرئيسية</a></li>
              <li><a routerLink="/cars" class="footer-link">تصفح السيارات</a></li>
              <li><a routerLink="/cars/add" class="footer-link">أضف سيارة للبيع</a></li>
              <li><a routerLink="/profile" class="footer-link">الملف الشخصي</a></li>
              <li><a routerLink="/login" class="footer-link">تسجيل الدخول</a></li>
            </ul>
          </div>

          <!-- Car Categories -->
          <div>
            <h4 class="text-xs font-black uppercase tracking-widest text-foreground mb-5 flex items-center gap-2">
              <i class="pi pi-car text-primary text-xs"></i>
              تصنيفات السيارات
            </h4>
            <ul class="space-y-3">
              <li><a routerLink="/cars" class="footer-link">سيارات جديدة</a></li>
              <li><a routerLink="/cars" class="footer-link">سيارات مستعملة</a></li>
              <li><a routerLink="/cars" class="footer-link">سيارات فاخرة</a></li>
              <li><a routerLink="/cars" class="footer-link">SUV والدفع الرباعي</a></li>
              <li><a routerLink="/cars" class="footer-link">سيارات اقتصادية</a></li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h4 class="text-xs font-black uppercase tracking-widest text-foreground mb-5 flex items-center gap-2">
              <i class="pi pi-phone text-primary text-xs"></i>
              تواصل معنا
            </h4>
            <ul class="space-y-4">
              <li class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i class="pi pi-phone text-primary text-xs"></i>
                </div>
                <div>
                  <p class="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-0.5">الهاتف</p>
                  <p class="text-sm font-bold text-foreground" dir="ltr">+966 50 000 0000</p>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i class="pi pi-envelope text-primary text-xs"></i>
                </div>
                <div>
                  <p class="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-0.5">البريد</p>
                  <p class="text-sm font-bold text-foreground" dir="ltr">info@motors.sa</p>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i class="pi pi-map-marker text-primary text-xs"></i>
                </div>
                <div>
                  <p class="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-0.5">العنوان</p>
                  <p class="text-sm font-bold text-foreground">الرياض، المملكة العربية السعودية</p>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>

      <!-- ── Bottom Bar ───────────────────────────────────────────────── -->
      <div class="border-t border-border/30 bg-muted/30">
        <div class="container mx-auto px-6 py-5">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <p class="text-muted-foreground text-xs font-bold tracking-wide">
              © {{ currentYear }} <span class="text-foreground font-black">MOTORS</span> — جميع الحقوق محفوظة
            </p>
            <div class="flex items-center gap-6">
              <a href="#" class="text-muted-foreground hover:text-foreground text-xs font-bold transition-colors tracking-wide">سياسة الخصوصية</a>
              <div class="w-px h-3 bg-border"></div>
              <a href="#" class="text-muted-foreground hover:text-foreground text-xs font-bold transition-colors tracking-wide">شروط الاستخدام</a>
              <div class="w-px h-3 bg-border"></div>
              <a href="#" class="text-muted-foreground hover:text-foreground text-xs font-bold transition-colors tracking-wide">اتصل بنا</a>
            </div>
          </div>
        </div>
      </div>

    </footer>
  `,
  styles: [`
    .footer-link {
      font-size: 13px;
      font-weight: 600;
      color: hsl(var(--muted-foreground));
      transition: color 0.2s, padding-right 0.2s;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .footer-link::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: hsl(var(--primary));
      opacity: 0;
      transition: opacity 0.2s;
      flex-shrink: 0;
    }
    .footer-link:hover {
      color: hsl(var(--foreground));
      padding-right: 4px;
    }
    .footer-link:hover::before {
      opacity: 1;
    }
  `],
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
