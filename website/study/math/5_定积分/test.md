---
date: 2026-05-26
---

# 判别法推导
## 1.无穷区间 $P$ 积分判别  
$\begin{array}{l}
\displaystyle 记~I_+ = \int_a^{+\infty} \frac{1}{x^\alpha} \mathrm{d}x = \lim_{b \to +\infty} \int_a^b \frac{1}{x^\alpha} \mathrm{d}x~(a>0) \\
\displaystyle I_+ = \lim_{b \to +\infty} \frac{x^{1-\alpha}}{1-\alpha}\Big|_{a}^b = \lim_{b \to +\infty} \frac{b^{1-\alpha}-a^{1-\alpha}}{1-\alpha} \\
\displaystyle ①~~\alpha > 1: 1-\alpha < 0, \lim_{b \to +\infty} b^{1-\alpha} \to 0 \\
\displaystyle I_+ = \lim_{b \to +\infty} \frac{b^{1-\alpha}-a^{1-\alpha}}{1-\alpha} = \frac{-a^{1-\alpha}}{1-\alpha} \Rightarrow 收敛 \\
②~~\alpha = 1: \\
\displaystyle I_+ = \lim_{b \to +\infty} \int_a^b \frac{1}{x} \mathrm{d}x = \lim_{b \to +\infty} \ln x|_a^b = \lim_{b \to +\infty} [\ln b - \ln a] = \infty \Rightarrow 发散 \\
\displaystyle ③~~\alpha < 1: 1-\alpha >0, \lim_{b \to +\infty} b^{1-\alpha} \to \infty \\
\displaystyle I_+ = \lim_{b \to +\infty} \frac{b^{1-\alpha}-a^{1-\alpha}}{1-\alpha} = \infty \Rightarrow 发散 \\
\end{array}$  
<Badge type="green">Conc</Badge> $\begin{align*}\alpha &> 1: \int_a^{+\infty} \frac{1}{x^\alpha} \mathrm{d}x ~收敛 \\ \alpha &\le 1: \int_a^{+\infty} \frac{1}{x^\alpha} \mathrm{d}x ~发散\end{align*}$

$\begin{array}{l}
\begin{aligned} I_+ &= \lim_{b \to +\infty} \int_a^b \frac{1}{x^\alpha} \mathrm{d}x \xlongequal{x=-t}\lim_{b \to +\infty} \int_{-b}^{-a} \frac{1}{(-x)^\alpha} \mathrm{d}x \\ 
&= \lim_{b \to +\infty} \int_{-b}^{-a} \frac{1}{|x|^\alpha} \mathrm{d}x = \lim_{b \to +\infty} \int_{-b}^{-a} \Big|\frac{1}{x^\alpha}\Big| \mathrm{d}x\end{aligned} \\
\displaystyle\therefore \lim_{b \to +\infty} \int_{-b}^{-a} \Big|\frac{1}{x^\alpha}\Big| \mathrm{d}x ~与~ I_+ ~有相同的敛散性 \\
\displaystyle 又根据绝对收敛: I_- = \lim_{b \to +\infty} \int_{-b}^{-a} \frac{1}{x^\alpha} \mathrm{d}x ~与~ I_+ ~有相同的敛散性 \\
\end{array}$  
<Badge type="green">Conc</Badge> $\begin{align*}\alpha &> 1: \int_{-\infty}^{-a} \frac{1}{x^\alpha} \mathrm{d}x ~收敛 \\ \alpha &\le 1: \int_{-\infty}^{-a} \frac{1}{x^\alpha} \mathrm{d}x ~发散\end{align*}$

## 2.瑕点无界 $P$ 积分判别  
$\begin{array}{l}
\displaystyle 记~I_a = \int_{a^+}^b \frac{1}{(x-a)^\alpha} \mathrm{d}x = \lim_{\varepsilon  \to 0^+} \int_{a+\varepsilon}^b \frac{1}{(x-a)^\alpha} \mathrm{d}x~(a>0) \\
\displaystyle I_a = \lim_{\varepsilon \to 0^+} \frac{(x-a)^{1-\alpha}}{1-\alpha}\Big|_{a+\varepsilon}^b = \lim_{\varepsilon \to 0^+} \frac{(b-a)^{1-\alpha}-\varepsilon^{1-\alpha}}{1-\alpha} \\
\displaystyle ①~~\alpha > 1: 1-\alpha < 0, \lim_{\varepsilon \to 0^+} \varepsilon^{1-\alpha} \to \infty \\
\displaystyle I_a = \lim_{\varepsilon \to 0^+} \frac{(b-a)^{1-\alpha}-\varepsilon^{1-\alpha}}{1-\alpha} = \infty \Rightarrow 发散 \\
②~~\alpha = 1: \\
\begin{aligned}I_a &= \lim_{\varepsilon \to 0^+} \int_{a+\varepsilon}^b \frac{1}{x-a} \mathrm{d}x = \lim_{\varepsilon \to 0^+} \ln (x-a)\Big|_{a+\varepsilon}^b \\
&= \lim_{\varepsilon \to 0^+} [\ln (b-a) - \ln \varepsilon]  = \infty \Rightarrow 发散\end{aligned} \\
\displaystyle ③~~\alpha < 1: 1-\alpha >0, \lim_{\varepsilon \to 0^+} \varepsilon^{1-\alpha} \to 0 \\
\displaystyle I_a = \lim_{\varepsilon \to 0^+} \frac{(b-a)^{1-\alpha}-\varepsilon^{1-\alpha}}{1-\alpha} = \frac{(b-a)^{1-\alpha}}{1-\alpha} \Rightarrow 收敛 \\
\end{array}$  
<Badge type="green">Conc</Badge> $\begin{array}{l}\displaystyle\alpha < 1: \lim_{\varepsilon \to 0^+} \int_{a+\varepsilon}^b \frac{1}{(x-a)^\alpha} \mathrm{d}x ~收敛 \\ \displaystyle\alpha \ge 1: \lim_{\varepsilon \to 0^+} \int_{a+\varepsilon}^b \frac{1}{(x-a)^\alpha} \mathrm{d}x ~发散\end{array}$

$\begin{array}{l}
\displaystyle I_a = \lim_{\varepsilon  \to 0^+} \int_{a+\varepsilon}^b \frac{1}{(x-a)^\alpha} \mathrm{d}x \xlongequal{x+t=a+b}\lim_{\varepsilon \to 0^+} \int_{a}^{b-\varepsilon} \frac{1}{(b-x)^\alpha} \mathrm{d}x \\
\displaystyle\therefore I_b = \lim_{\varepsilon \to 0^+} \int_{a}^{b-\varepsilon} \frac{1}{(b-x)^\alpha} \mathrm{d}x ~与~ I_a ~有相同的敛散性 \\
\end{array}$  
<Badge type="green">Conc</Badge> $\begin{align*}\alpha &< 1: \lim_{\varepsilon \to 0^+} \int_{a}^{b-\varepsilon} \frac{1}{(b-x)^\alpha} \mathrm{d}x ~收敛 \\ \alpha &\ge 1: \lim_{\varepsilon \to 0^+} \int_{a}^{b-\varepsilon} \frac{1}{(b-x)^\alpha} \mathrm{d}x ~发散\end{align*}$


## 极限形式 $P$ 判别法
### 1.无穷区间
对于积分 $I_+ = \displaystyle \int_{a}^{+\infty} \frac{1}{x^\alpha} dx \ (a>0)$，我们已经知道：  
$\int_{a}^{+\infty} \frac{1}{x^\alpha} dx
\begin{cases}
\text{收敛}, & \alpha>1 \\
\text{发散}, & \alpha \le 1
\end{cases}$

设 $f(x), g(x)$ 在 $[a,+\infty)$ 上非负连续，基准函数 $g(x) = \frac{1}{x^\alpha}$  
$\displaystyle\lim_{x \to +\infty} \frac{f(x)}{g(x)} = \lim_{x \to +\infty} x^\alpha{f(x)} = L$

1. $\alpha > 1$  
    * 若 $0 < L < +\infty:$ $\int f(x)dx$ 与 $\int g(x)dx$ 同敛散，因此 $\int f(x)dx ~收敛;$
    * 若 $L=0:$ $\int g(x)dx ~收敛 \Rightarrow \int f(x)dx ~收敛.$  

$\displaystyle\Rightarrow \exists ~\alpha>1, \lim_{x\to+\infty} x^\alpha f(x) ~存在~ \implies \int_a^{+\infty} f(x)dx ~收敛$

2. $\alpha \le 1$  
    * 若 $0 < L < +\infty:$ $\int f(x)dx$ 与 $\int g(x)dx$ 同敛散，因此 $\int f(x)dx ~发散;$
    * 若 $L=+\infty:$ $\int g(x)dx ~发散 \Rightarrow \int f(x)dx ~发散.$

$\displaystyle\Rightarrow \exists ~\alpha \le 1, \lim_{x\to+\infty} x^\alpha f(x) = k(\ne0) ~或~ \infty \implies \int_a^{+\infty} f(x)dx ~发散$

::: important 极限形式比较判别法
$\displaystyle\lim_{x\to\Box} \frac{f(x)}{g(x)} = L, f(x) \ge 0, g(x) \ge 0$

1. $0<L<+\infty:$ $\displaystyle\int f(x)\mathrm dx$ 与 $\displaystyle\int g(x)\mathrm dx$ **同敛散**  
2. $L=0:$ 若 $\displaystyle\int g(x)\mathrm dx$ 收敛，则 $\displaystyle\int f(x)\mathrm dx$ **收敛**  
3. $L=+\infty:$ 若 $\displaystyle\int g(x)\mathrm dx$ 发散，则 $\displaystyle\int f(x)\mathrm dx$ **发散**  

:::
