
function openContactModal(service) {
  document.getElementById('contactModal').classList.add('active');
}

function closeContactModal() {
  document.getElementById('contactModal').classList.remove('active');
}

function handleFormSubmit(event) {
  event.preventDefault();
  document.getElementById('contactForm').style.display = 'none';
  document.getElementById('successMessage').style.display = 'block';
}

document.querySelectorAll(".see-raw").forEach(btn => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".portfolio-tile");
    const before = card.querySelector(".thumb.before");

    before.style.transform = "translateX(0)";

    setTimeout(() => {
      before.style.transform = "translateX(-100%)";
    }, 2200);
  });
});

const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');

mobileToggle.addEventListener('click', () => {
  mobileToggle.classList.toggle('is-active');
  navMenu.classList.toggle('open');
});

window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

document.addEventListener('mousemove', (e) => {
  const glow = document.querySelector('.glow-bg');
  glow.style.left = `${e.clientX}px`;
  glow.style.top = `${e.clientY}px`;
});

document.getElementById('yr').textContent = new Date().getFullYear();

function initCalculator() {
    const nicheData = {
        finance: { rpm: 18, ctr: 8, cvr: 2.5, aov: 150 },
        business: { rpm: 15, ctr: 6, cvr: 3.0, aov: 500 },
        tech: { rpm: 12, ctr: 5, cvr: 1.8, aov: 120 },
        ecom: { rpm: 10, ctr: 7, cvr: 2.0, aov: 85 }
    };

    let currentNiche = 'finance';

    const impRange = document.getElementById('impRange');
    const ctrRange = document.getElementById('ctrRange');
    const rpmRange = document.getElementById('rpmRange');
    const cvrRange = document.getElementById('cvrRange');
    const aovRange = document.getElementById('aovRange');

    const impVal = document.getElementById('impVal');
    const ctrVal = document.getElementById('ctrVal');
    const rpmVal = document.getElementById('rpmVal');
    const cvrVal = document.getElementById('cvrVal');
    const aovVal = document.getElementById('aovVal');

    const adRevenueEl = document.getElementById('adRevenue');
    const salesRevenueEl = document.getElementById('salesRevenue');
    const totalRevenueEl = document.getElementById('totalRevenue');

    function formatNumber(num, prefix = '', suffix = '') {
        const isFloat = num % 1 !== 0;
        let formattedNum;
        if (num >= 1000) {
            formattedNum = (num / 1000).toFixed(1) + 'k';
        } else {
            formattedNum = isFloat ? num.toFixed(1) : num.toLocaleString();
        }
        return prefix + formattedNum + suffix;
    }
    
    function animateValue(element, start, end, duration, prefix = '', suffix = '') {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentValue = progress * (end - start) + start;
            
            if (prefix === '$') {
                element.textContent = prefix + Math.round(currentValue).toLocaleString();
            } else {
                element.textContent = prefix + currentValue.toFixed(1) + suffix;
            }

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    function updateCalculations() {
        const impressions = parseInt(impRange.value);
        const ctr = parseFloat(ctrRange.value) / 100;
        const rpm = parseInt(rpmRange.value);
        const cvr = parseFloat(cvrRange.value) / 100;
        const aov = parseInt(aovRange.value);

        impVal.textContent = formatNumber(impressions);
        ctrVal.textContent = (ctr * 100).toFixed(1) + '%';
        rpmVal.textContent = '$' + rpm;
        cvrVal.textContent = (cvr * 100).toFixed(1) + '%';
        aovVal.textContent = '$' + aov;

        const views = impressions * ctr;
        const adRevenue = (views / 1000) * rpm;
        const salesRevenue = views * cvr * aov;
        const totalRevenue = adRevenue + salesRevenue;

        animateValue(adRevenueEl, parseFloat(adRevenueEl.textContent.replace(/[^\d.]/g, '')) || 0, adRevenue, 500, '$');
        animateValue(salesRevenueEl, parseFloat(salesRevenueEl.textContent.replace(/[^\d.]/g, '')) || 0, salesRevenue, 500, '$');
        animateValue(totalRevenueEl, parseFloat(totalRevenueEl.textContent.replace(/[^\d.]/g, '')) || 0, totalRevenue, 500, '$');
    }

    function setNiche(niche) {
        currentNiche = niche;
        const data = nicheData[niche];

        rpmRange.value = data.rpm;
        ctrRange.value = data.ctr;
        cvrRange.value = data.cvr;
        aovRange.value = data.aov;

        document.querySelectorAll('.niche-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`.niche-btn[data-niche="${niche}"]`).classList.add('active');

        updateCalculations();
    }

    document.querySelectorAll('.niche-btn').forEach(btn => {
        btn.addEventListener('click', () => setNiche(btn.dataset.niche));
    });

    [impRange, ctrRange, rpmRange, cvrRange, aovRange].forEach(slider => {
        slider.addEventListener('input', updateCalculations);
    });

    setNiche('finance');

    const exportBtn = document.getElementById('exportBtn');
    exportBtn.addEventListener('click', () => {
        const impressions = impRange.value;
        const ctr = ctrRange.value;
        const rpm = rpmRange.value;
        const cvr = cvrRange.value;
        const aov = aovRange.value;

        const adRevenue = adRevenueEl.textContent;
        const salesRevenue = salesRevenueEl.textContent;
        const totalRevenue = totalRevenueEl.textContent;

        const data = [
            ['Niche', currentNiche],
            ['Impressions', impressions],
            ['CTR (%)', ctr],
            ['RPM ($)', rpm],
            ['CVR (%)', cvr],
            ['AOV ($)', aov],
            [],
            ['Ad Revenue', adRevenue],
            ['Sales Revenue', salesRevenue],
            ['Total Revenue', totalRevenue]
        ];

        let csvContent = "data:text/csv;charset=utf-8,";

        data.forEach(function(rowArray) {
            let row = rowArray.join(",");
            csvContent += row + "\r\n";
        });

        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "revenue_projection.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', initCalculator);

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const paths = document.querySelectorAll('#cred .icon path, #guarantee .g-ico path');

  paths.forEach(path => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    gsap.from(path, {
      strokeDashoffset: 0,
      duration: 2,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: path,
        start: "top 80%",
        end: "bottom 20%",
        scrub: true
      }
    });
  });
});
