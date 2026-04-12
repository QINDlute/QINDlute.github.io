::: whiteboard 罗尔中值定理
## Th1. (Rolle)
<Badge type="warning">If</Badge>  
① $f(x)\in c[a,b]；$  
② $f(x)在(a,b)内可导$  
③ $f(a)=f(b)$

$then{\color{Red}\exists \zeta \in (a,b)，使f'(\zeta) =0}$

<Badge type="note">证:</Badge>

$f(x)\in c[a,b]\Rightarrow \exists m，M.$  
① $m=M$  
$f(x)\equiv C_{0} ，则\forall \zeta \in (a,b)，有f'(\zeta) = 0；$  
② $m<M$  
$\because f(a)=f(b).$  
$\therefore m，M至少一个在(a,b)内取到。$  
$设\exists \zeta \in (a,b).$  
$使f(\zeta)=M \Rightarrow \zeta 为极大点 \Rightarrow f'(\zeta) = 0 或不存在$  
$\because f(x)可导$  
$\therefore f'(\zeta) = 0$
:::

<!-- 中文句号”。”为标题内换行 -->
::: faq-math 例1.f(x)\in c[0,2],(0,2)内可导.3f(0)=f(1)+2f(2).。
证：\exists \zeta \in (0,2),使f'(\zeta ) =0.#

证：  
$1^{0}. f(x) \in c[1,2] \Rightarrow f(x)在[1,2]上有m,M.$  
$3m \le f(1)+2f(2) \le 3M \Rightarrow m \le \frac{f(1)+2f(2)}{3} \le M.$  
$\exists c \in [1,2],使f(c)= \frac{f(1)+2(f2)}{3} \Rightarrow f(1)+2f(2)=3f(c)$  
$2^{0}. \because f(0)=f(c)$`（罗尔中值定理）`  
$\therefore \exists \zeta \in (0,c) \subset (0,2),使f'(\zeta) = 0$
:::

::: whiteboard 拉格朗日中值定理（狭义上的微分中值定理）
## Th2. (Lagrange)⭐
<Badge type="warning">If</Badge>

① $f(x)\in c[a,b]；$  
② $f(x)在(a,b)内可导$

$then{\color{Red}\exists \zeta \in (a,b),使f'(\zeta) = \frac{f(b)-f(a)}{b-a}}$

<Badge type="note">分析:</Badge>

$L_{曲}:y=f(x)$  
$L_{AB}:y-f(a)=\frac{f(b)-f(a)}{b-a}(x-a)$  
$即L_{AB}:y=f(a)+\frac{f(b)-f(a)}{b-a}(x-a)$  

<Badge type="note">证:</Badge>

$令\varphi (x)=曲-直=f(x)-f(a)-\frac{f(b)-f(a)}{b-a}(x-a)$  
$\varphi (x) \in c[a,b].在(a,b)内可导$`（函数的加减乘不会改变其连续性）`  
$又\varphi (a)=\varphi (b)=0$  
$\therefore \exists \zeta \in (a,b),使{\varphi (\zeta)}' = 0$  
$而{\varphi}'(x)=f'(x)-\frac{f(b)-f(a)}{b-a}$  
$\therefore f'(\zeta) = \frac{f(b)-f(a)}{b-a}$

<Badge type="danger">Notes:</Badge>

① $如果 f(a)=f(b)，则L \Rightarrow R;(Rolle定理 \subset Lagrange定理)$  
② $f'(\zeta) = \frac{f(b)-f(a)}{b-a} \Leftrightarrow f(b)-f(a) = f'(\zeta)(b-a) \Leftrightarrow f(b)-f(a)=f'[a+(b-a)\theta](b-a)(0 < \theta < 1)$  
③ $f(x)可导.则f(x)-f(a)=f'(\zeta)(x-a)=f'(a+(b-a)\theta)(x-a)(0 < \theta < 1)$
:::

::: faq-math 例2.\lim_{x \to \infty} f'(x)=e.求\lim_{x \to \infty}[f(x+1)-f(x-1)]. #
解：  
$1^{0}. f(x+1)-f(x-1)=2f'(\zeta)(x-1<\zeta<x+1).$`(Lagrange)`  
$2^{0}. 原式=2\lim_{x \to \infty} f'(\zeta)=2\lim_{\zeta \to \infty} f'(\zeta)=2e.$
:::

::: whiteboard 柯西中值定理
## Th3. (Cauchy)
<Badge type="warning">If</Badge>

① $f(x),g(x)在[a,b]上连续;$  
② $f(x),g(x)在(a,b)内可导;$  
③ $g'(x) \ne 0 (a<x<b);$

$then{\color{Red}\exists \zeta \in (a,b)，使\frac{f(b)-f(a)}{g(b)-g(a)}=\frac{f'(\zeta)}{g'(\zeta)}}$

<Badge type="danger">Notes:</Badge>

① If $g(x)=x,则C \Rightarrow L;(Lagrange定理 \subset Cauchy定理)$  
②
$g'(x) \ne 0 (a<x<b) \Rightarrow
\left\{\begin{matrix}
    g'(\zeta) \ne 0;\\
    g(b)-g(a) \ne 0;
\end{matrix}\right.$  
③  
$L:\varphi (x)=f(x)-f(a)-\frac{f(b)-f(a)}{b-a}(x-a)$  
$C:\varphi (x)=f(x)-f(a)-\frac{f(b)-f(a)}{g(b)-g(a)}[g(x)-g(a)]$

<Badge type="note">证:</Badge>

$令\varphi (x)=f(x)-f(a)-\frac{f(b)-f(a)}{g(b)-g(a)}[g(x)-g(a)]$  
$\varphi (x) \in c[a,b],(a,b)内可导$  
$\because \varphi (a)=\varphi (b)=0$  
$\therefore \exists \zeta \in (a,b),使\varphi' (\zeta)=0$`(罗尔中值定理)`  
$而\varphi'(x)=f'(x)-\frac{f(b)-f(a)}{g(b)-g(a)}g'(x)$  
$\therefore f'(\zeta)=\frac{f(b)-f(a)}{g(b)-g(a)}g'(\zeta)$  
$\because g'(\zeta) \ne 0$  
$\therefore \frac{f(b)-f(a)}{g(b)-g(a)}=\frac{f'(\zeta)}{g'(\zeta)}$
:::

::: whiteboard 泰勒展开
## Th4. (Taylor)
<Badge type="warning">If</Badge>

$f(x)在x=x_0领域内n+1阶可导$

$then{\color{Red} f(x)=P_n(x)+R_n(x)}$

:::