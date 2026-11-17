// 用途別ページ②一人飲み(hitori.html)・③新潟の魚と鯛出汁(niigata.html)を、案内ページ(index.html)と master.json の文章から作る
// （忘年会ページ bonenkai.html は build_bonenkai.js）。文章を直すときは index.html のFAQ・master.json を直して build_site.js --apply
const fs=require('fs');
const h=fs.readFileSync('index.html','utf8');
const M=JSON.parse(fs.readFileSync('master.json','utf8'));
const css=h.match(/<style>([\s\S]*?)<\/style>/)[1];
const faqAll=Object.fromEntries([...h.matchAll(/<details><summary>([^<]*)<\/summary><p>([^<]*)<\/p><\/details>/g)].map(m=>[m[1],m[2]]));
const URL=M.shop.url,GMAP='https://www.google.com/maps?cid=17396166259396505679';
function faq(qs){qs.forEach(q=>{if(!faqAll[q])throw Error('faq missing '+q)});return qs}
function page({file,title,desc,h1,lead,chips,body,qs,imgs}){
  const Q=faq(qs);
  const ld={'@context':'https://schema.org','@type':'FAQPage',mainEntity:Q.map(q=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:faqAll[q]}}))};
  const faqHtml=Q.map(q=>`<details><summary>${q}</summary><p>${faqAll[q]}</p></details>`).join('\n');
  const imgHtml=(imgs||[]).map(i=>`<img src="${i.src}" alt="${i.alt}" width="${i.w||450}" height="${i.h||600}" loading="lazy" style="max-width:100%;height:auto;border-radius:8px">`).join('');
  const html=`<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${URL}${file}">
<style>${css}
.back{font-size:.9rem;margin:0 0 12px}.vo{font-size:.9rem;color:var(--sub)}
</style>
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body>
<main>
<p class="back"><a href="./">← 魚串BARの案内ページ（トップ）</a></p>
<h1>${h1}</h1>
<p class="lead">${lead}</p>
<p class="tel"><a class="call" href="tel:+819065307591">📞 電話で予約 ${M.shop.tel}</a><a class="form" href="./#reserve">ネットで予約リクエスト</a></p>
<ul class="chips">${chips.map(c=>`<li>${c}</li>`).join('')}</ul>
${body}
${imgHtml?`<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin:12px 0">${imgHtml}</div>`:''}
<h2>よくある質問</h2>
${faqHtml}
<h2>お客様の口コミ</h2>
<p>実際にご来店いただいたお客様の口コミは、Googleマップでご覧いただけます。</p>
<p><a href="${GMAP}" rel="noopener">Googleマップで、魚串BARの口コミを見る</a></p>
<h2>場所と営業</h2>
<div class="card"><dl>
<dt>営業時間</dt><dd>${M.shop.hours.replace('／','<br>')}</dd>
<dt>定休日</dt><dd>${M.shop.closed}</dd>
<dt>場所</dt><dd>${M.shop.address}<br>${M.shop.station}</dd>
<dt>喫煙</dt><dd>${M.shop.smoking}</dd>
</dl></div>
<p class="tel"><a class="call" href="tel:+819065307591">📞 電話で予約 ${M.shop.tel}</a><a class="form" href="./#reserve">ネットで予約リクエスト</a></p>
<p><a href="./">魚串BARの案内ページ（トップ）</a>｜<a href="bonenkai.html">忘年会・貸切</a>｜<a href="hitori.html">一人飲み・2軒目</a>｜<a href="niigata.html">新潟・糸魚川の魚と鯛出汁</a></p>
<footer>運営：魚串BAR（${M.shop.name}／${M.shop.kana}）店主 下高。このページの内容は、店主がお店の最新の情報に合わせて更新しています。</footer>
</main>
</body>
</html>
`;
  JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  fs.writeFileSync(file,html);console.log(file,html.length,'bytes');
}
page({file:'hitori.html',
 title:'なんば・心斎橋で一人飲み・2軒目｜魚串は1本から・全席喫煙可｜魚串BAR',
 desc:'なんば・心斎橋の魚串BARは、お一人様歓迎。魚串は1本から、カウンター7席。2軒目に、鯛出汁の〆も。全席喫煙可。18:00〜24:00（金・土は翌1:00）。',
 h1:'なんば・心斎橋で一人飲み・2軒目<br>魚串は1本から、お一人様歓迎',
 lead:`${M.shop.name}（${M.shop.kana}）の、お一人様・2軒目のご利用のご案内です。`,
 chips:['お一人様歓迎','魚串は1本から','カウンター7席','全席喫煙可','18:00〜24:00（金・土は翌1:00）'],
 body:`<h2>こんな使い方ができます</h2>
<div class="card"><dl>
<dt>1軒目に</dt><dd>名物の魚串を、1本ずつ。焼き串・揚げ串で、いろいろな魚を少しずつ楽しめます。直送のお造りは、九州の甘口醤油でお召し上がりいただけます。</dd>
<dt>2軒目に</dt><dd>魚串1本とお酒1杯から、軽くご利用いただけます。鯛出汁茶碗蒸し、〆の鯛出汁ラーメンもあります。日本酒・焼酎も取りそろえています。</dd>
<dt>お一人様で</dt><dd>カウンターは7席です。お一人様も歓迎です。全席喫煙可です。</dd>
</dl></div>
<figure style="margin:12px 0;text-align:center"><img src="img/interior_counter.jpg" alt="カウンター席とテーブル席（お一人様も歓迎です）" width="984" height="984" loading="lazy" style="max-width:80%;height:auto;border-radius:8px"><figcaption class="vo">カウンターは7席です。奥にテーブル席があります。</figcaption></figure>
<figure style="margin:12px 0;text-align:center"><img src="img/skewers1.jpg" alt="魚串の盛り合わせ（写真は4人前）" width="900" height="1200" loading="lazy" style="max-width:70%;height:auto;border-radius:8px"><figcaption class="vo">魚串の盛り合わせ。写真は4人前です。魚串は1本から注文できます。</figcaption></figure>
<figure style="margin:12px 0;text-align:center"><img src="img/skewers2.jpg" alt="魚串の盛り合わせ（写真は2人前）" width="900" height="1200" loading="lazy" style="max-width:70%;height:auto;border-radius:8px"><figcaption class="vo">魚串の盛り合わせ。写真は2人前です。</figcaption></figure>
<p class="vo">席だけのご予約も、承ります（ネットは明日以降の日にちから。当日はお電話で）。</p>`,
 qs:['一人でも入れますか？','2軒目や、軽く一杯だけでも大丈夫ですか？','喫煙できますか？','予約はいつまでにすればいいですか？','日本酒はありますか？','テイクアウトはできますか？'],
 imgs:[{src:'img/sashimi1.jpg',alt:'お造り盛り合わせ（日によって魚は変わります）',w:1200,h:900}]});
page({file:'niigata.html',
 title:'新潟・糸魚川直送の魚と鯛出汁｜なんば・心斎橋の海鮮居酒屋｜魚串BAR',
 desc:'なんば・心斎橋の魚串BARは、新潟・糸魚川から直送の鮮魚を、魚串（1本から）と鯛出汁で。お造り、鯛出汁しゃぶ、〆の鯛出汁ラーメン。日本酒・焼酎も。全席喫煙可。',
 h1:'新潟・糸魚川から直送の魚を、<br>魚串と鯛出汁で',
 lead:`${M.shop.name}（${M.shop.kana}）の、魚と鯛出汁のご案内です。`,
 chips:['新潟・糸魚川から直送','魚串は1本から','鯛出汁しゃぶ','日本酒・焼酎','全席喫煙可'],
 body:`<h2>魚のこと</h2>
<p>魚は、新潟・糸魚川から直送しています。届いた魚を、お造りや魚串などでお出しします。焼き串・揚げ串は1本から注文できるので、いろいろな魚を少しずつ楽しめます。</p>
<figure style="margin:12px 0;text-align:center"><img src="img/fishbox1.jpg" alt="ある日の入荷の魚（日によって変わります）" width="800" height="1422" loading="lazy" style="max-width:55%;height:auto;border-radius:8px"><figcaption class="vo">ある日の入荷です。魚は日によって変わります。</figcaption></figure>
<figure style="margin:12px 0;text-align:center"><img src="img/skewers1.jpg" alt="魚串の盛り合わせ（写真は4人前）" width="900" height="1200" loading="lazy" style="max-width:70%;height:auto;border-radius:8px"><figcaption class="vo">魚串の盛り合わせ。写真は4人前です。魚串は1本から注文できます。</figcaption></figure>
<h2>鯛出汁のこと</h2>
<p>鯛の骨からとった鯛出汁を、しゃぶしゃぶ・茶碗蒸し・〆の鯛出汁ラーメンでどうぞ。</p>
<figure style="margin:12px 0;text-align:center"><img src="img/taishabu1.jpg" alt="鯛出汁しゃぶしゃぶの鯛の薄造りと鯛出汁" width="900" height="1056" loading="lazy" style="max-width:80%;height:auto;border-radius:8px"><figcaption class="vo">鯛出汁しゃぶしゃぶ。薄く切った鯛を、鯛出汁にくぐらせます。</figcaption></figure>
<figure style="margin:12px 0;text-align:center"><img src="img/ramen2.jpg" alt="〆の鯛出汁ラーメン" width="900" height="1200" loading="lazy" style="max-width:62%;height:auto;border-radius:8px"><figcaption class="vo">〆の鯛出汁ラーメン。</figcaption></figure>
<figure style="margin:12px 0;text-align:center"><img src="img/chawan1.jpg" alt="鯛出汁の茶碗蒸し" width="900" height="1200" loading="lazy" style="max-width:62%;height:auto;border-radius:8px"><figcaption class="vo">鯛出汁の茶碗蒸し。</figcaption></figure>
<figure style="margin:12px 0;text-align:center"><img src="img/mapomen1.jpg" alt="鯛出汁麻婆麺" width="900" height="1200" loading="lazy" style="max-width:62%;height:auto;border-radius:8px"><figcaption class="vo">鯛出汁麻婆麺。</figcaption></figure>
<figure style="margin:12px 0;text-align:center"><img src="img/takimeshi1.jpg" alt="鯛の炊き込みご飯" width="900" height="1200" loading="lazy" style="max-width:62%;height:auto;border-radius:8px"><figcaption class="vo">鯛の炊き込みご飯。</figcaption></figure>
<figure style="margin:12px 0;text-align:center"><img src="img/seiro1.jpg" alt="ぶりのせいろ蒸し" width="900" height="1200" loading="lazy" style="max-width:62%;height:auto;border-radius:8px"><figcaption class="vo">ぶりのせいろ蒸し（コースの一品です）。</figcaption></figure>
<h2>お酒</h2>
<p>日本酒・焼酎も取りそろえています。すべてのコースの90分飲み放題に、日本酒（地酒）も含まれます。</p>
<figure style="margin:12px 0;text-align:center"><img src="img/sake1.jpg" alt="ある日の日本酒のボトル（入荷により変わります）" width="1000" height="750" loading="lazy" style="max-width:100%;height:auto;border-radius:8px"><figcaption class="vo">ある日の日本酒。入荷により変わります。</figcaption></figure>
<figure style="margin:12px 0;text-align:center"><img src="img/sake2.jpg" alt="日本酒のボトル（入荷により変わります）" width="750" height="1000" loading="lazy" style="max-width:62%;height:auto;border-radius:8px"><figcaption class="vo">銘柄は、入荷により変わります。</figcaption></figure>
<figure style="margin:12px 0;text-align:center"><img src="img/sake3.jpg" alt="日本酒のボトル（入荷により変わります）" width="1000" height="750" loading="lazy" style="max-width:100%;height:auto;border-radius:8px"><figcaption class="vo">入荷により変わります。</figcaption></figure>
<h2>新潟県の公式ページに載っています</h2>
<p>新潟県大阪事務所の「<a href="https://www.pref.niigata.lg.jp/sec/osaka/kansaiyukari.html" rel="noopener">関西にある新潟ゆかりのお店</a>」（新潟県産品が味わえる飲食店）に掲載されています。</p>`,
 qs:['どこの魚を使っていますか？','鯛を使った料理はありますか？','日本酒はありますか？','一人でも入れますか？'],
 imgs:[{src:'img/sashimi1.jpg',alt:'お造り盛り合わせ（日によって魚は変わります）',w:1200,h:900}]});
