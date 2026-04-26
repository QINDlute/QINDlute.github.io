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