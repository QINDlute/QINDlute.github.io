---
date: 2026-04-26
---

# 错题集-拉格朗日中值定理

① $f(b)-f(a)、\frac{f(b)-f(a)}{b-a}、f(a) \ne f(b)$ - L  
② $f(a)、f(c)、f(b)\;或\;f'(a)、f'(c)、f'(b)$ - 2L

::: faq-math 例1.\;\lim_{x \to \infty} f'(x) = e.\;\lim_{x \to \infty} [f(x+2)-f(x)]=\lim_{x \to \infty} {(\frac{x+a}{x-a})^x},求\;a.#
解:  
$\frac{f(x+2)-f(x)}{2}=f'(\zeta),\zeta \in (x,x+2);$  
$即\;f(x+2)-f(x)=2f'(\zeta)$  
$左=2\lim_{x \to \infty} f'(\zeta) = 2e;$(夹逼定理)  
$右=\lim_{x \to \infty} {[(1+\frac{2a}{x-a})^{\frac{x-a}{2a}}]^{x \frac{2a}{x-a}}} = e^{2a};$  
$\Rightarrow e^{2a} = 2e \Rightarrow 2a = 1 + \ln 2 \Rightarrow a = \frac{1+\ln 2}{2}.$

:::

::: faq-math 例2.\;求\;\lim_{x \to \infty} {x^2(e^{\frac{1}{2x-1}}-e^{\frac{1}{2x+1}})}.#
解:  
$令f(x)=e^{\frac{1}{2x}},f'(x)=-{\frac{e^{\frac{1}{2x}}}{2x^2}}$  
$e^{\frac{1}{2x-1}}-e^{\frac{1}{2x+1}} = -(f(x+\frac{1}{2})-f(x-\frac{1}{2})) = -f'(\zeta),\zeta \in (x-\frac{1}{2},x+\frac{1}{2})$  
$得f'(\zeta) = \frac{e^{\frac{1}{2\zeta}}}{2\zeta^2}$  
$原式 = \lim_{x \to \infty} {x^2 \frac{e^{\frac{1}{2\zeta}}}{2\zeta^2}}$  
$\because \zeta \in (x-\frac{1}{2},x+\frac{1}{2})$  
$\therefore \;当\;x \to \infty \Rightarrow \zeta \to \infty 且 \zeta \sim x$  
$\Rightarrow 原式 = \frac{1}{2} \lim_{x \to \infty} {e^{\frac{1}{2\zeta}}} = \frac{1}{2}.$

:::