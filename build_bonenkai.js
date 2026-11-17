// 忘年会ページ(bonenkai.html)を、案内ページ(index.html)の文章から作る（コース・FAQの文言を親と同じにするため）
const fs=require('fs');
const h=fs.readFileSync('index.html','utf8');
const css=h.match(/<style>([\s\S]*?)<\/style>/)[1];
const course=h.match(/<h2>コース（90分飲み放題付き・税込）<\/h2>([\s\S]*?<\/ul>)/)[1].trim();
const faqAll=Object.fromEntries([...h.matchAll(/<details><summary>([^<]*)<\/summary><p>([^<]*)<\/p><\/details>/g)].map(m=>[m[1],m[2]]));
const want=['個室はありますか？','忘年会でたばこは吸えますか？','飲み放題は何分ですか？','大人数で座れますか？','貸切はできますか？','予約はいつまでにすればいいですか？','忘年会のご予算はどのくらいですか？'];
want.forEach(q=>{if(!faqAll[q])throw Error('faq missing '+q)});
const faqHtml=want.map(q=>`<details><summary>${q}</summary><p>${faqAll[q]}</p></details>`).join('\n');
const ld={'@context':'https://schema.org','@type':'FAQPage',mainEntity:want.map(q=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:faqAll[q]}}))};
const URL='https://chissaiocchan-star.github.io/uokushi-guide/';
const GMAP='https://www.google.com/maps?cid=17396166259396505679';
const page=`<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>なんば・心斎橋の忘年会｜9〜13名様は貸切・全席喫煙可｜魚串BAR</title>
<meta name="description" content="なんば・心斎橋の忘年会は、9〜13名様なら、お店まるごと貸切。「個室」はありませんが、他のお客様が入らない空間で、全席喫煙可。90分飲み放題付き（日本酒・地酒も）4,950円〜7,150円（税込）。">
<link rel="canonical" href="${URL}bonenkai.html">
<style>${css}
.back{font-size:.9rem;margin:0 0 12px}.vo{font-size:.9rem;color:var(--sub)}
</style>
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body>
<main>
<p class="back"><a href="./">← 魚串BARの案内ページ（トップ）</a></p>
<h1>なんば・心斎橋の忘年会<br>9〜13名様は、お店まるごと貸切／全席喫煙可</h1>
<p class="lead">新潟糸魚川直送　鯛出汁と魚串の海鮮居酒屋　魚串BAR（サカナクシバル）の、忘年会・ご宴会のご案内です。</p>
<p class="tel"><a class="call" href="tel:+819065307591">📞 電話で予約 090-6530-7591</a><a class="form" href="./#reserve">ネットで予約リクエスト</a></p>
<ul class="chips"><li>9〜13名様は貸切</li><li>全席喫煙可</li><li>90分飲み放題付き（日本酒・地酒も）</li><li>4,950円〜7,150円（税込）</li><li>5名様以上は囲み席（最大13名様）</li></ul>

<h2>「個室」はありませんが、貸切にできます</h2>
<p>9〜13名様は、お店まるごと貸切にできます。他のお客様が入らない、完全プライベートな空間で、ご宴会を楽しめます。5名様以上は、テーブルをつなげた囲み席（最大13名様）にもできます。席は、カウンター7席・テーブル8席（4名卓が2つ）、合計15席です。</p>
<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center"><img src="img/kakoi1.jpg" alt="テーブルをつなげた囲み席。5名様以上、最大13名様まで" width="450" height="600" loading="lazy" style="max-width:100%;height:auto;border-radius:8px"><img src="img/kakoi2.jpg" alt="囲み席のセッティング例。5名様以上、最大13名様まで" width="450" height="600" loading="lazy" style="max-width:100%;height:auto;border-radius:8px"></div>

<h2>全席喫煙可です</h2>
<p>ご宴会の途中でも、席を立たずに、お席でたばこを吸えます（禁煙席はありません）。20歳未満の方は、ご入店いただけません。</p>

<h2>コース（すべて90分飲み放題付き・税込）</h2>
${course}
<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;align-items:flex-start"><figure style="margin:0;flex:1 1 240px;text-align:center"><img src="img/buri1.jpg" alt="ぶりしゃぶのお刺身と鍋" width="800" height="1067" loading="lazy" style="max-width:100%;height:auto;border-radius:8px"><figcaption class="vo">ぶりしゃぶ。</figcaption></figure><figure style="margin:0;flex:1 1 240px;text-align:center"><img src="img/kinmedai1.jpg" alt="金目鯛のしゃぶしゃぶ用のお刺身" width="1000" height="750" loading="lazy" style="max-width:100%;height:auto;border-radius:8px"><figcaption class="vo">金目鯛のしゃぶしゃぶ（ある日の例です）。</figcaption></figure></div>
<p class="vo">ご予算・内容のご相談も承ります。お電話（090-6530-7591）か、予約リクエストフォームからどうぞ。</p>

<h2>日程と営業</h2>
<div class="card"><dl>
<dt>営業時間</dt><dd>月〜木 18:00〜24:00（L.O. 23:30）<br>金・土・祝前日 18:00〜翌1:00（L.O. 24:00）</dd>
<dt>定休日</dt><dd>日曜・祝日。年末年始は12/31〜1/5（1/6から営業）。</dd>
<dt>場所</dt><dd>大阪市中央区心斎橋筋2-3-5 日宝ファインプラザ1F<br>なんば駅 徒歩4分／心斎橋駅 徒歩6分</dd>
</dl></div>

<h2>よくある質問</h2>
${faqHtml}

<h2>お客様の口コミ</h2>
<p>実際にご来店いただいたお客様の口コミは、Googleマップでご覧いただけます。</p>
<p><a href="${GMAP}" rel="noopener">Googleマップで、魚串BARの口コミを見る</a></p>

<p class="tel"><a class="call" href="tel:+819065307591">📞 電話で予約 090-6530-7591</a><a class="form" href="./#reserve">ネットで予約リクエスト</a></p>
<p><a href="./">魚串BARの案内ページ（トップ）</a>｜<a href="bonenkai.html">忘年会・貸切</a>｜<a href="hitori.html">一人飲み・2軒目</a>｜<a href="niigata.html">新潟・糸魚川の魚と鯛出汁</a>｜<a href="https://tabelog.com/osaka/A2701/A270202/27087494/">食べログ</a>｜<a href="https://retty.me/area/PRE27/ARE94/SUB9401/100001360615/">Retty</a></p>
<footer>運営：魚串BAR（新潟糸魚川直送　鯛出汁と魚串の海鮮居酒屋　魚串BAR／サカナクシバル）店主 下高。このページの内容は、店主がお店の最新の情報に合わせて更新しています。</footer>
</main>
</body>
</html>
`;
fs.writeFileSync('bonenkai.html',page);
JSON.parse(page.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
console.log('bonenkai.html',page.length,'bytes, ld ok');
