import { onMounted, onUnmounted } from 'vue';

/**
 * useScrollReveal — Intersection Observer composable
 * Tự động thêm class "revealed" cho các element có class "reveal"
 * khi chúng scroll vào viewport.
 *
 * @param {string} selector   — CSS selector (mặc định: '.reveal')
 * @param {number} threshold  — % element cần hiện trong viewport (0 → 1)
 */
export function useScrollReveal(selector = '.reveal', threshold = 0.12) {
    let observer;

    onMounted(() => {
        observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target); // chỉ chạy 1 lần
                    }
                });
            },
            { threshold }
        );

        // Observe tất cả element phù hợp selector
        document.querySelectorAll(selector).forEach((el) => observer.observe(el));
    });

    onUnmounted(() => {
        if (observer) observer.disconnect();
    });
}
