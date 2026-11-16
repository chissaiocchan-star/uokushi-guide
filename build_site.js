// 魚串BAR 案内ページの「マスターデータ」(master.json) から、同じ内容を使う場所を作る/確かめる道具（2026-11-17〜）
//   node build_site.js --init   index.html の今の内容から master.json を作る（最初の1回）
//   node build_site.js --check  index.html の コース表・予約フォームの選択肢・JS説明・JSON-LDのコースが master.json と同じか確かめる
//   node build_site.js --apply  master.json の内容で、上の4か所を index.html に書き込み、llms.txt と bonenkai.html も作り直す
// コースの名前・価格・内容を変えるときは master.json だけ直して --apply する（ページごとの手直しをなくして、ずれを防ぐ）。
const fs=require('fs');
const mode=process.argv[2]||'--check';
const P='index.html';
let h=fs.readFileSync(P,'utf8');
const fmt=n=>Number(n).toLocaleString('en-US');
const LI=/(<h2>コース（90分飲み放題付き・税込）<\/h2>\s*<p>[^<]*<\/p>\s*<ul>\n)([\s\S]*?)(<\/ul>)/;
const SEL=/(<select name="course" required>)([\s\S]*?)(<\/select>)/;
const MAP=/var C=(\{[\s\S]*?\});/;
function ldBlock(){const m=h.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);return {raw:m[1],obj:JSON.parse(m[1])}}

if(mode==='--init'){
  const lis=[...h.match(LI)[2].matchAll(/<li><strong>(.+?)　([\d,]+)円<\/strong>(?:（(\d+)品）)?(.*?)<\/li>/g)];
  const opts=[...h.match(SEL)[2].matchAll(/<option>(.*?)<\/option>/g)].map(m=>m[1]);
  const map=JSON.parse(h.match(MAP)[1]);
  const courses=lis.map(m=>{
    const name=m[1],price=Number(m[2].replace(/,/g,''));
    const selectLabel=opts.find(o=>o.startsWith(name.replace(/ぶりのせいろ蒸しを入れた?コース/,'ぶりのせいろ蒸しを入れたコース').replace(/焼き串、逸品を味わう$/,'焼き串、逸品を味わうコース').replace(/鯛出汁の出汁しゃぶプラン/,'鯛出汁の出汁しゃぶプラン')));
    const mapKey=Object.keys(map).find(k=>name.startsWith(k.replace(/コース$/,''))||k.startsWith(name));
    return {name,price,items:m[3]||'',content:m[4],selectLabel,mapKey,mapText:map[mapKey]};
  });
  const bad=courses.filter(c=>!c.selectLabel||!c.mapKey);if(bad.length)throw Error('対応が取れないコース: '+bad.map(c=>c.name));
  const master={shop:{name:'新潟糸魚川直送　鯛出汁と魚串の海鮮居酒屋　魚串BAR',kana:'サカナクシバル',address:'大阪市中央区心斎橋筋2-3-5 日宝ファインプラザ1F',station:'なんば駅 徒歩4分／心斎橋駅 徒歩6分',tel:'090-6530-7591',
    hours:'月〜木 18:00〜24:00（L.O. 23:30）／金・土・祝前日 18:00〜翌1:00（L.O. 24:00）',closed:'日曜・祝日。年末年始は12/31〜1/5（1/6から営業）',
    seats:'カウンター7席・テーブル8席（4名卓が2つ、合計15席）。お一人様歓迎。5名様以上は囲み席にできます（最大13名様）。「個室」はありませんが、9〜13名様はお店まるごと貸切にできます。',
    smoking:'全席喫煙可（禁煙席なし）。20歳未満の方はご入店いただけません。',origin:'新潟・糸魚川から直送の鮮魚',url:'https://chissaiocchan-star.github.io/uokushi-guide/'},
    drinkNote:'すべてのコースに、90分飲み放題が付いています。日本酒（地酒）も飲み放題に含まれます。',courses,
    extraSelect:['忘年会・宴会のご予算・内容フレキシブルコース（ご相談）','席のみ（コースなし）'],
    extraMap:{'忘年会・宴会':map['忘年会・宴会'],'席のみ':map['席のみ']}};
  fs.writeFileSync('master.json',JSON.stringify(master,null,1)+'\n');console.log('master.json を作りました。コース',courses.length,'本');process.exit(0);
}

const M=JSON.parse(fs.readFileSync('master.json','utf8'));
const liHtml=M.courses.map(c=>`<li><strong>${c.name}　${fmt(c.price)}円</strong>${c.items?`（${c.items}品）`:''}${c.content}</li>`).join('\n')+'\n';
const selHtml=M.courses.map(c=>`<option>${c.selectLabel}</option>`).join('')+M.extraSelect.map(s=>`<option>${s}</option>`).join('');
const mapObj={};M.courses.slice().sort((a,b)=>b.price-a.price).forEach(c=>mapObj[c.mapKey]=c.mapText);Object.assign(mapObj,M.extraMap);
const mapJs='var C='+JSON.stringify(mapObj)+';';
// 予約フォームの選択肢は価格の高い順に並べる（案内ページの今の並び）。コースの表は master の並びのまま
const selOrder=M.courses.slice().sort((a,b)=>b.price-a.price);
const selHtml2=selOrder.map(c=>`<option>${c.selectLabel}</option>`).join('')+M.extraSelect.map(s=>`<option>${s}</option>`).join('');
function menuLd(){return {'@type':'Menu',name:'宴会コース（すべて90分飲み放題付き・日本酒（地酒）も含む・税込）',hasMenuSection:[{'@type':'MenuSection',name:'コース',hasMenuItem:M.courses.map(c=>({'@type':'MenuItem',name:c.name,description:c.content,offers:{'@type':'Offer',price:String(c.price),priceCurrency:'JPY'}}))}]}}

function build(){
  let o=h;
  o=o.replace(LI,(m,a,b,c)=>a+liHtml+c);
  o=o.replace(SEL,(m,a,b,c)=>a+selHtml2+c);
  o=o.replace(MAP,()=>mapJs);
  const lm=o.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);const ld=JSON.parse(lm[1]);ld.hasMenu=menuLd();
  o=o.replace(lm[1],()=>JSON.stringify(ld));
  return o;
}
const next=build();
if(mode==='--check'){
  if(next===h){console.log('OK: index.html は master.json と同じです');process.exit(0)}
  const a=h.split('\n'),b=next.split('\n');let n=0;for(let i=0;i<Math.max(a.length,b.length);i++)if(a[i]!==b[i]){n++;if(n<=4)console.log('差分 行'+(i+1)+':\n  いま : '+(a[i]||'').slice(0,120)+'\n  master: '+(b[i]||'').slice(0,120))}
  console.log('NG: '+n+'行ちがいます（--apply で master に合わせます）');process.exit(1);
}
if(mode==='--apply'){
  fs.writeFileSync(P,next);h=next;
  const s=M.shop;
  const llms=`# ${s.name}（${s.kana}）

> 大阪・なんば／心斎橋の海鮮居酒屋。${s.origin}を、魚串（1本から）と鯛出汁で。全席喫煙可、お一人様歓迎。このファイルは、お店が自分で書いた公式の情報です。

## 基本情報
- 住所: ${s.address}（${s.station}）
- 電話: ${s.tel}
- 営業時間: ${s.hours}
- 定休日: ${s.closed}
- 席: ${s.seats}
- 喫煙: ${s.smoking}

## コース（${M.drinkNote}税込）
${M.courses.map(c=>`- ${c.name}: ${fmt(c.price)}円 — ${c.content}`).join('\n')}

## ページ
- [公式の案内ページ（予約リクエストフォーム）](${s.url})
- [忘年会・貸切のご案内](${s.url}bonenkai.html)

## 掲載ページ
- [食べログ](https://tabelog.com/osaka/A2701/A270202/27087494/)
- [Retty](https://retty.me/area/PRE27/ARE94/SUB9401/100001360615/)
- [Instagram](https://www.instagram.com/sakanakushibar.uokushi/)
- [新潟県大阪事務所「関西にある新潟ゆかりのお店」](https://www.pref.niigata.lg.jp/sec/osaka/kansaiyukari.html)
`;
  fs.writeFileSync('llms.txt',llms);
  require('child_process').execSync('node build_bonenkai.js',{stdio:'inherit'});
  console.log('apply 完了: index.html / llms.txt / bonenkai.html');
}
