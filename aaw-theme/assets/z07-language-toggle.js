(function () {
  const languages = {
    en: { htmlLang: "en" },
    zh: { htmlLang: "zh-Hans" },
    zhHant: { htmlLang: "zh-Hant" },
    ja: { htmlLang: "ja" },
    ko: { htmlLang: "ko" }
  };

  const keepEnglish = new Set([
    "Those who listen will find the way."
  ]);

  const rows = [
  ["Home","首页","首頁","ホーム","홈"],
  ["Z Series","Z 系列","Z 系列","Zシリーズ","Z 시리즈"],
  ["Z07","Z07","Z07","Z07","Z07"],
  ["AAW Z Series Universal - Tubeless Hybrid Reference","AAW Z 系列通用型 - 无导管混合参考级耳机","AAW Z 系列通用型 - 無導管混合參考級耳機","AAW Zシリーズ ユニバーサル - チューブレスハイブリッドリファレンス","AAW Z 시리즈 유니버설 - 튜브리스 하이브리드 레퍼런스"],
  ["Tubeless Hybrid Reference Monitor","无导管混合参考级监听耳机","無導管混合參考級監聽耳機","チューブレスハイブリッドリファレンスモニター","튜브리스 하이브리드 레퍼런스 모니터"],
  ["Z07 leads with FitMorph adaptive fit, then reveals a tubeless hybrid tuning. A 10mm titanium dynamic driver, six balanced armatures, and a true 3-way crossover come together in a monitor made to settle quickly, fit more ears, and bring the intended tuning into focus sooner.","Z07 首先以 FitMorph 自适应佩戴技术打动你，随后展现出无导管混合调音的魅力。10mm 钛金属动圈、六枚动铁单元和真正的三路分频协同工作，打造出一副能快速贴合、适配更多耳型、让你更快进入调音本真状态的监听耳机。","Z07 首先以 FitMorph 自適應佩戴技術打動你，隨後展現出無導管混合調音的魅力。10mm 鈦金屬動圈、六枚平衡電樞單體和真正的三路分頻協同工作，打造出一副能快速貼合、適配更多耳型、讓你更快進入調音本真狀態的監聽耳機。","Z07 はまず FitMorph アダプティブフィットで耳に馴染み、その後にチューブレスハイブリッドチューニングを明らかにします。10mm チタンダイナミックドライバー、6基の BA、そして真の3ウェイクロスオーバーが一体となり、素早くフィットし、より多くの耳に合い、意図されたチューニングを早く捉えられるモニターを実現します。","Z07은 먼저 FitMorph 적응형 핏으로 귀에 맞춰지고, 이어서 튜브리스 하이브리드 튜닝을 드러냅니다. 10mm 티타늄 다이내믹 드라이버, 6개의 BA, 진정한 3웨이 크로스오버가 하나로 모여 빠르게 안정되고, 더 많은 귀에 맞으며, 의도된 튜닝을 더 빨리 집중할 수 있는 모니터를 만듭니다."],
  ["Those who listen will find the way.","Those who listen will find the way.","Those who listen will find the way.","Those who listen will find the way.","Those who listen will find the way."],
  ["Price","价格","價格","価格","가격"],
  ["Z07 customer rating","Z07 用户评分","Z07 用戶評分","Z07 カスタマーレーティング","Z07 고객 평점"],
  ["FitMorph adaptive fit","FitMorph 自适应佩戴","FitMorph 自適應佩戴","FitMorph アダプティブフィット","FitMorph 적응형 핏"],
  ["Tube-free acoustic chamber","无导管声学腔体","無導管聲學腔體","チューブレス音響チャンバー","튜브리스 어쿠스틱 챔버"],
  ["1 dynamic + 6 BA","1 动圈 + 6 动铁","1 動圈 + 6 平衡電樞","1 ダイナミック + 6 BA","1 다이내믹 + 6 BA"],
  ["10Hz-40kHz response","10Hz-40kHz 频响","10Hz-40kHz 頻響","10Hz-40kHz 周波数特性","10Hz-40kHz 주파수 응답"],
  ["Buy Z07","购买 Z07","購買 Z07","Z07 を購入","Z07 구매하기"],
  ["Explore FitMorph","探索 FitMorph","探索 FitMorph","FitMorph を詳しく見る","FitMorph 살펴보기"],
  ["AAW Z07 tubeless hybrid in-ear monitor on marble with green acoustic module","置于大理石背景上的 AAW Z07 无导管混合入耳式监听耳机，配绿色声学模块","置於大理石背景上的 AAW Z07 無導管混合入耳式監聽耳機，配綠色聲學模組","大理石の上に置かれた AAW Z07 チューブレスハイブリッドIEM（グリーン音響モジュール付き）","대리석 배경 위에 놓인 AAW Z07 튜브리스 하이브리드 IEM (녹색 음향 모듈 포함)"],
  ["Product summary","产品摘要","產品摘要","製品概要","제품 요약"],
  ["AAW Z07 is a universal-fit hybrid IEM led by FitMorph adaptive fit, a tubeless acoustic chamber, a 10mm titanium dynamic driver, six balanced armatures, and a true 3-way crossover. It helps more listeners reach a steady seal faster, so bass, imaging, and stability feel right from the first listen.","AAW Z07 是一款通用型混合入耳式耳机，以 FitMorph 自适应佩戴、无导管声学腔体、10mm 钛金属动圈、六枚动铁单元和真正的三路分频为核心。它能帮助更多用户快速获得稳定的密封，让低频、结像和稳定性从一开始就处于正确状态。","AAW Z07 是一款通用型混合入耳式耳機，以 FitMorph 自適應佩戴、無導管聲學腔體、10mm 鈦金屬動圈、六枚平衡電樞單體和真正的三路分頻為核心。它能幫助更多用戶快速獲得穩定的密封，讓低頻、結像和穩定性從一開始就處於正確狀態。","AAW Z07 は、FitMorph アダプティブフィット、チューブレス音響チャンバー、10mm チタンダイナミックドライバー、6基の BA、そして真の3ウェイクロスオーバーを核とするユニバーサルフィットハイブリッド IEM です。より多くのリスナーが迅速に安定した密閉を得られるように設計され、低域、イメージング、安定性が最初から正しく感じられます。","AAW Z07은 FitMorph 적응형 핏, 튜브리스 어쿠스틱 챔버, 10mm 티타늄 다이내믹 드라이버, 6개의 BA, 진정한 3웨이 크로스오버를 핵심으로 하는 유니버설 핏 하이브리드 IEM입니다. 더 많은 청취자가 빠르게 안정적인 밀착감을 얻을 수 있도록 도와주어 저음, 이미징, 안정성이 첫 청취부터 올바르게 느껴집니다."],
  ["Fit","佩戴","佩戴","フィット感","착용감"],
  ["FitMorph fit options","FitMorph 佩戴选项","FitMorph 佩戴選項","FitMorph フィットオプション","FitMorph 핏 옵션"],
  ["Drivers","单元","單體","ドライバー","드라이버"],
  ["Acoustic path","声学路径","聲學路徑","音響経路","음향 경로"],
  ["Tube-free / filter-free","无导管 / 无阻尼网","無導管 / 無阻尼網","チューブレス / フィルターレス","튜브리스 / 필터 프리"],
  ["Spec","规格","規格","スペック","스펙"],
  ["12 Ohm / 101dB / THD <0.5%","12Ω / 101dB / 总谐波失真 <0.5%","12Ω / 101dB / 總諧波失真 <0.5%","12Ω / 101dB / THD <0.5%","12옴 / 101dB / THD <0.5%"],
  ["FitMorph Adaptive Fit","FitMorph 自适应佩戴","FitMorph 自適應佩戴","FitMorph アダプティブフィット","FitMorph 적응형 핏"],
  ["Fit first, then the sound opens up","佩戴先行，声音随后展开","佩戴先行，聲音隨後展開","まずフィット、そしてサウンドが開ける","핏이 먼저, 그리고 사운드가 열립니다"],
  ["FitMorph:","FitMorph：","FitMorph：","FitMorph：","FitMorph:"],
  ["one Z07 tuning, three fit paths. Choose shark-fin stability, a cleaner finless contour, or optional custom outer-ear lock-in without changing the sound you chose.","同一副 Z07 调音，三种佩戴方式。选择鲨鱼鳍式稳固、更干净的无鳍轮廓，或者可选的外耳定制锁定，都不改变你选择的音质。","同一副 Z07 調音，三種佩戴方式。選擇鯊魚鰭式穩固、更乾淨的無鰭輪廓，或者可選的外耳客製鎖定，都不改變你選擇的音質。","ひとつの Z07 チューニング、3つのフィット経路。シャークフィン安定型、すっきりフィンレス形状、またはオプションのカスタム外耳固定から選択。選んだサウンドは変わりません。","하나의 Z07 튜닝, 세 가지 핏 경로. 샤크핀 안정형, 깔끔한 핀리스 윤곽, 또는 선택형 맞춤 외이 고정 중에서 선택하되, 선택한 사운드는 그대로 유지됩니다."],
  ["Fit is part of what you hear. When an IEM shifts, bass pressure, center image, and stage focus shift with it. Z07 keeps the same tuning across interchangeable FitMorph options, so the outer shape can adapt to your ear without asking you to give up the Z07 sound.","佩戴是你所听到的声音的一部分。当耳机移位时，低频压力、中心结像和舞台聚焦都会随之改变。Z07 在所有可互换的 FitMorph 选项中保持相同的调音，因此外壳形状可以适应你的耳朵，而无需你放弃 Z07 的声音。","佩戴是你所聽到的聲音的一部分。當耳機移位時，低頻壓力、中心結像和舞台聚焦都會隨之改變。Z07 在所有可互換的 FitMorph 選項中保持相同的調音，因此外殼形狀可以適應你的耳朵，而無需你放棄 Z07 的聲音。","フィットは聴こえの一部です。IEM が動くと、低域の圧力、センターイメージ、ステージの焦点も変わります。Z07 は交換可能な FitMorph オプション全体で同じチューニングを維持するため、外側の形状をあなたの耳に合わせても、Z07 のサウンドを犠牲にする必要はありません。","핏은 청취의 일부입니다. IEM이 움직이면 저음 압력, 중앙 이미징, 스테이지 포커스도 함께 변합니다. Z07은 교체 가능한 FitMorph 옵션 전반에 걸쳐 동일한 튜닝을 유지하므로, 외부 형태는 귀에 맞춰도 Z07 사운드를 포기할 필요가 없습니다."],
  ["The goal is simple: get to a confident seal faster. Once the monitor feels settled, Z07 can show its intended bass weight, vocal placement, and imaging without the constant urge to readjust the shell.","目标很简单：更快获得可靠的密封。一旦耳机佩戴稳定，Z07 就能展现出它本来的低频厚度、人声位置和结像，无需反复调整腔体。","目標很簡單：更快獲得可靠的密封。一旦耳機佩戴穩定，Z07 就能展現出它本來的低頻厚度、人聲位置和結像，無需反覆調整腔體。","目標はシンプルです。自信を持って密閉できる状態に早く到達すること。モニターが落ち着いたと感じられたら、Z07 は意図された低域の重み、ボーカルの定位、イメージングを、シェルを再調整したい衝動なしに見せてくれます。","목표는 간단합니다. 자신 있게 빠르게 밀착감을 얻는 것입니다. 모니터가 안정되었다고 느껴지면, Z07은 셸을 다시 조정하고 싶은 충동 없이 의도된 저음의 무게감, 보컬 위치, 이미징을 보여줍니다."],
  ["AAW Z07 FitMorph interchangeable fit options, tuning body, screwdriver, and screws","AAW Z07 FitMorph 可互换佩戴配件、调音主体、螺丝刀及螺丝","AAW Z07 FitMorph 可互換佩戴配件、調音主體、螺絲起子及螺絲","AAW Z07 FitMorph 交換可能フィットオプション、チューニングボディ、ドライバー、ネジ","AAW Z07 FitMorph 교체형 핏 옵션, 튜닝 바디, 드라이버, 나사"],
  ["FitMorph gives Z07 three clear fit paths: shark-fin stability, finless comfort, or optional custom outer-ear lock-in.","FitMorph 为 Z07 提供三种清晰的佩戴方式：鲨鱼鳍式稳固、无鳍式舒适，或者可选的外耳定制锁定。","FitMorph 為 Z07 提供三種清晰的佩戴方式：鯊魚鰭式穩固、無鰭式舒適，或者可選的外耳客製鎖定。","FitMorph は Z07 に3つの明確なフィット経路を提供します。シャークフィン安定型、フィンレス快適型、またはオプションのカスタム外耳固定。","FitMorph는 Z07에 세 가지 명확한 핏 경로를 제공합니다. 샤크핀 안정형, 핀리스 편안함, 또는 선택형 맞춤 외이 고정."],
  ["With Shark Fin","带鲨鱼鳍","帶鯊魚鰭","シャークフィンあり","샤크핀 있음"],
  ["Maximum lock-in for stage use, movement, and longer listening sessions.","舞台使用、活动或长时间聆听时提供最大程度的锁定效果。","舞台使用、活動或長時間聆聽時提供最大程度的鎖定效果。","ステージ使用、動き、長時間リスニングに最大の固定感。","스테이지 사용, 움직임, 장시간 청취 시 최대한의 고정감."],
  ["Without Shark Fin","不带鲨鱼鳍","不帶鯊魚鰭","シャークフィンなし","샤크핀 없음"],
  ["A cleaner contour with less outer-ear pressure for smaller ears or lighter wear.","更干净的轮廓，外耳压力更小，适合小耳朵或轻量佩戴。","更乾淨的輪廓，外耳壓力更小，適合小耳朵或輕量佩戴。","外耳への圧力が少ないすっきりした形状。小さな耳や軽い装着感に。","외이 압력이 적은 깔끔한 윤곽. 작은 귀나 가볍게 착용할 때 적합합니다."],
  ["Customized Fit","定制佩戴","客製佩戴","カスタムフィット","맞춤형 핏"],
  ["Optional bespoke outer-ear fit option from ear impressions, while the canal still seals with LiquidMorph silicone tips.","可选的外耳定制佩戴方案（基于耳印模），耳道部分仍由 LiquidMorph 硅胶耳塞套密封。","可選的外耳客製佩戴方案（基於耳印模），耳道部分仍由 LiquidMorph 矽膠耳塞套密封。","耳型 impression から作成するオプションのオーダーメイド外耳フィット。耳道は引き続き LiquidMorph シリコンイヤーピースで密閉します。","귀 인상 채취를 통한 맞춤형 외이 핏 옵션. 이도는 여전히 LiquidMorph 실리콘 이어팁으로 밀착됩니다."],
  ["Design Journey","设计历程","設計歷程","デザインジャーニー","디자인 여정"],
  ["Designed and tuned by founder","创始人设计与调音","創辦人設計與調音","創業者による設計・チューニング","창립자 디자인 및 튜닝"],
  ["Z07 started from a familiar listener frustration: many IEMs promise bigger driver counts, but the daily experience still comes down to whether the shell stays comfortable, sealed, and steady. AAW wanted Z07 to feel different before the first track even reaches the chorus.","Z07 的诞生源于一个常见的用户痛点：许多耳机宣称单元数量更多，但日常体验最终还是要看腔体是否舒适、密封是否可靠、佩戴是否稳定。AAW 希望 Z07 在第一首歌进入副歌之前，就能让你感受到它的不同。","Z07 的誕生源於一個常見的用戶痛點：許多耳機宣稱單體數量更多，但日常體驗最終還是要看腔體是否舒適、密封是否可靠、佩戴是否穩定。AAW 希望 Z07 在第一首歌進入副歌之前，就能讓你感受到它的不同。","Z07 の出発点は、よくあるリスナーの不満でした。多くの IEM はより多くのドライバー数を謳うものの、日常的な体験は結局のところ、シェルが快適で、密閉され、安定しているかどうかにかかっています。AAW は Z07 が、最初のトラックのサビに達する前に、その違いを感じられるようにしたかったのです。","Z07은 흔한 청취자들의 불만에서 출발했습니다. 많은 IEM이 더 많은 드라이버 수를 약속하지만, 일상적인 경험은 결국 셸이 편안하고, 밀착되고, 안정적인지에 달려 있습니다. AAW는 Z07이 첫 트랙의 후렴구에 도달하기 전에 그 차이를 느낄 수 있기를 원했습니다."],
  ["For Kevin Wang, the challenge was not only how many drivers could fit inside a shell. It was how to give one universal monitor more than one way to sit securely in the ear, while keeping the same tuning character. FitMorph became the answer: choose the fit support that suits your ear, then let the same Z07 tuning come through.","对 Kevin Wang 来说，挑战不仅在于一个腔体能塞下多少单元，更在于如何让一副通用型耳机拥有多种稳固佩戴的方式，同时保持同一种调音特性。FitMorph 便是答案：选择适合你耳朵的佩戴支撑，然后让同一副 Z07 的调音自然呈现。","對 Kevin Wang 來說，挑戰不僅在於一個腔體能塞下多少單體，更在於如何讓一副通用型耳機擁有多種穩固佩戴的方式，同時保持同一種調音特性。FitMorph 便是答案：選擇適合你耳朵的佩戴支撐，然後讓同一副 Z07 的調音自然呈現。","Kevin Wang にとって、課題はシェルにいくつのドライバーを収められるかだけではありませんでした。ひとつのユニバーサルモニターに、同じチューニング特性を維持しながら、耳にしっかりと固定するための複数の方法を与えることでした。FitMorph がその答えです。あなたの耳に合うフィットサポートを選び、同じ Z07 チューニングをそのまま楽しんでください。","Kevin Wang에게 과제는 단순히 셸에 몇 개의 드라이버를 넣을 수 있느냐가 아니었습니다. 하나의 유니버설 모니터에 동일한 튜닝 특성을 유지하면서 귀에 안정적으로 착용할 수 있는 여러 가지 방법을 제공하는 것이었습니다. FitMorph가 그 해답입니다. 귀에 맞는 핏 서포트를 선택하고, 동일한 Z07 튜닝을 그대로 경험하세요."],
  ["That thinking shaped the rest of Z07. The tubeless hybrid tuning, precision aluminium core, secure 2-pin connection, and adaptive FitMorph options all serve one listener goal: more confidence in the fit, more time with the music, and fewer reasons to keep adjusting the monitor.","这一理念塑造了 Z07 的其余部分。无导管混合调音、精密铝制核心、稳固的 2-pin 连接以及自适应的 FitMorph 选项，都服务于同一个目标：对佩戴更有信心，花更多时间在音乐上，减少不断调整耳机的理由。","這一理念塑造了 Z07 的其餘部分。無導管混合調音、精密鋁製核心、穩固的 2-pin 連接以及自適應的 FitMorph 選項，都服務於同一個目標：對佩戴更有信心，花更多時間在音樂上，減少不斷調整耳機的理由。","この考え方が Z07 の他の部分を形作りました。チューブレスハイブリッドチューニング、精密アルミニウムコア、確実な 2ピン接続、適応型 FitMorph オプションはすべて、ひとつのリスナー目標に奉仕します。フィットへの確信を高め、音楽により多くの時間を費やし、モニターを調整し続ける理由を減らすことです。","이러한 사고방식이 Z07의 나머지 부분을 형성했습니다. 튜브리스 하이브리드 튜닝, 정밀 알루미늄 코어, 안정적인 2핀 연결, 적응형 FitMorph 옵션은 모두 하나의 청취자 목표를 위해 봉사합니다. 핏에 대한 확신을 높이고, 음악에 더 많은 시간을 할애하며, 모니터를 계속 조정해야 하는 이유를 줄이는 것입니다."],
  ["A great tuning is wasted if the monitor hurts, shifts, or loses seal before the listener can stay with the music. Z07 was designed to make the fit part of the performance, not an afterthought.","如果耳机在听众沉浸到音乐之前就引起不适、移位或失去密封，再好的调音也白费。Z07 旨在将佩戴作为性能的一部分，而非事后补救。","如果耳機在聽眾沉浸到音樂之前就引起不適、移位或失去密封，再好的調音也白費。Z07 旨在將佩戴作為性能的一部分，而非事後補救。","リスナーが音楽に没入する前に、モニターが痛かったり、ずれたり、密閉が失われたりするようでは、優れたチューニングも無駄になります。Z07 は、フィットを後付けではなく、パフォーマンスの一部にするよう設計されています。","청취자가 음악에 몰입하기 전에 모니터가 불편하거나 움직이거나 밀착감을 잃으면 아무리 훌륭한 튜닝도 소용없습니다. Z07은 핏을 단순한 부가물이 아닌 성능의 일부로 만들기 위해 설계되었습니다."],
  ["Kevin Wang","Kevin Wang","Kevin Wang","Kevin Wang","Kevin Wang"],
  ["Founder & Tuning Engineer, Advanced AcousticWerkes","Advanced AcousticWerkes 创始人 & 调音工程师","Advanced AcousticWerkes 創辦人 & 調音工程師","Advanced AcousticWerkes 創業者 / チューニングエンジニア","Advanced AcousticWerkes 창립자 겸 튜닝 엔지니어"],
  ["Kevin Wang signature","Kevin Wang 签名","Kevin Wang 簽名","Kevin Wang サイン","Kevin Wang 서명"],
  ["Tubeless Sound Path","无导管声学路径","無導管聲學路徑","チューブレスサウンドパス","튜브리스 사운드 패스"],
  ["A cleaner path from driver to ear","从单元到耳朵的更纯净路径","從單體到耳朵的更純淨路徑","ドライバーから耳へのクリーンな経路","드라이버에서 귀까지 더 깔끔한 경로"],
  ["Z07 sound path:","Z07 声学路径：","Z07 聲學路徑：","Z07 サウンドパス：","Z07 사운드 패스:"],
  ["each driver plays into a tube-free, filter-free acoustic chamber, helping Z07 sound cleaner and more immediate from bass to air.","每个单元的声音都汇入无导管、无阻尼网的声学腔体，让 Z07 从低频到高频都更干净、更直接。","每個單體的聲音都匯入無導管、無阻尼網的聲學腔體，讓 Z07 從低頻到高頻都更乾淨、更直接。","各ドライバーがチューブレス・フィルターレスの音響チャンバーに直接入ることで、Z07 は低域から空気感までよりクリーンでダイレクトなサウンドを実現します。","각 드라이버의 소리가 튜브리스, 필터 프리 어쿠스틱 챔버로 직접 전달되어 Z07이 저음부터 공기감까지 더 깔끔하고 직접적으로 들리게 합니다."],
  ["Many multi-driver IEMs rely on tubes, dampers, and filters before the sound reaches your ear. Z07 takes a more direct route: once FitMorph gives you a secure seal, the tubeless chamber and true 3-way crossover help bass weight, vocal placement, and treble air arrive with less haze.","许多多单元入耳式耳机在声音到达耳朵之前依赖于导管、阻尼器和滤网。Z07 采用了更直接的路径：一旦 FitMorph 为你提供可靠的密封，无导管腔体和真正的三路分频就能让低频厚度、人声定位和高频空气感以更少朦胧感传达。","許多多單元入耳式耳機在聲音到達耳朵之前依賴於導管、阻尼器和濾網。Z07 採用了更直接的路徑：一旦 FitMorph 為你提供可靠的密封，無導管腔體和真正的三路分頻就能讓低頻厚度、人聲定位和高頻空氣感以更少朦朧感傳達。","多くのマルチドライバー IEM は、音が耳に届くまでにチューブ、ダンパー、フィルターに依存しています。Z07 はより直接的な経路を取ります。FitMorph が確実な密閉をもたらしたら、チューブレスチャンバーと真の3ウェイクロスオーバーが、低域の重み、ボーカルの定位、高域の空気感を、曇りの少ない状態で届けます。","많은 멀티드라이버 IEM은 소리가 귀에 도달하기 전에 튜브, 댐퍼, 필터에 의존합니다. Z07은 더 직접적인 경로를 택합니다. FitMorph가 안정적인 밀착감을 제공하면, 튜브리스 챔버와 진정한 3웨이 크로스오버가 저음의 무게감, 보컬 위치, 고음의 공기감을 더 적은 안개와 함께 전달합니다."],
  ["You hear the benefit as a quicker, cleaner presentation: titanium dynamic bass for weight, four balanced armatures for midrange body, and two balanced armatures for high-frequency air and space.","你能听到的好处是更迅速、更干净的呈现：钛金属动圈负责有厚度的低频，四枚动铁负责中频的饱满度，两枚动铁负责高频的空气感和空间感。","你能聽到的好處是更迅速、更乾淨的呈現：鈦金屬動圈負責有厚度的低頻，四枚平衡電樞負責中頻的飽滿度，兩枚平衡電樞負責高頻的空氣感和空間感。","そのメリットは、より速く、よりクリーンなプレゼンテーションとして聞こえます。チタンダイナミックによる重みのある低域、4基の BA による中域のボディ、2基の BA による高域の空気感と空間。","그 혜택은 더 빠르고 깔끔한 프레젠테이션으로 들립니다. 티타늄 다이내믹이 무게감 있는 저음을, 4개의 BA가 중역의 바디감을, 2개의 BA가 고역의 공기감과 공간감을 담당합니다."],
  ["View the driver layout","查看单元布局","查看單體佈局","ドライバーレイアウトを見る","드라이버 레이아웃 보기"],
  ["AAW Z07 split view showing FitMorph outer-ear support and tubeless sound path","AAW Z07 分解图，展示 FitMorph 外耳支撑与无导管声学路径","AAW Z07 分解圖，展示 FitMorph 外耳支撐與無導管聲學路徑","AAW Z07 分解図。FitMorph 外耳サポートとチューブレスサウンドパスを示す。","AAW Z07 분해도, FitMorph 외이 서포트와 튜브리스 사운드 패스 표시"],
  ["Sub-bass / bass","极低频 / 低频","極低頻 / 低頻","副低域 / 低域","서브베이스 / 저음"],
  ["10mm Titanium Dynamic","10mm 钛金属动圈","10mm 鈦金屬動圈","10mm チタンダイナミック","10mm 티타늄 다이내믹"],
  ["Deep extension, pressure control, and fast decay without midrange bloom.","下潜深、压力控制好、衰减快，且不会造成中频泛滥。","下潛深、壓力控制好、衰減快，且不會造成中頻氾濫。","深い拡張、圧力制御、高速減衰。中域への回り込みなし。","깊은 확장, 압력 제어, 빠른 감쇠. 중역 범벅 현상 없음."],
  ["Midrange / highs","中频 / 高频","中頻 / 高頻","中域 / 高域","중역 / 고역"],
  ["Six Balanced Armatures","六枚动铁单元","六枚平衡電樞單體","6基の BA","6개의 BA 드라이버"],
  ["Quad BA mids and dual BA highs keep vocals, air, and imaging precisely layered.","四枚动铁负责中频，两枚动铁负责高频，让人声、空气感和结像精准分层。","四枚平衡電樞負責中頻，兩枚平衡電樞負責高頻，讓人聲、空氣感和結像精準分層。","4基の BA が中域、2基の BA が高域を担当し、ボーカル、空気感、イメージングを正確にレイヤードします。","4개의 BA가 중역, 2개의 BA가 고역을 담당하여 보컬, 공기감, 이미징을 정밀하게 레이어링합니다."],
  ["Overview","概览","概覽","概要","개요"],
  ["A compact reference monitor that starts with fit","从佩戴开始的紧凑型参考级监听耳机","從佩戴開始的緊湊型參考級監聽耳機","フィットから始まるコンパクトなリファレンスモニター","핏에서 시작하는 컴팩트 레퍼런스 모니터"],
  ["What it is","它是什么","它是什麼","製品概要","제품 소개"],
  ["A seven-driver universal hybrid IEM with a tubeless acoustic chamber and FitMorph adaptive fit system.","七单元通用型混合入耳式耳机，配备无导管声学腔体和 FitMorph 自适应佩戴系统。","七單體通用型混合入耳式耳機，配備無導管聲學腔體和 FitMorph 自適應佩戴系統。","チューブレス音響チャンバーと FitMorph アダプティブフィットシステムを備えた 7ドライバー・ユニバーサルハイブリッド IEM。","튜브리스 어쿠스틱 챔버와 FitMorph 적응형 핏 시스템을 갖춘 7드라이버 유니버설 하이브리드 IEM."],
  ["Why it matters","为何重要","為何重要","重要性","중요한 이유"],
  ["A stable fit keeps bass pressure, vocal center, and imaging consistent instead of changing every time the shell shifts.","稳定的佩戴能让低频压力、人声中心和结像保持一致，而不是每次腔体移动就改变。","穩定的佩戴能讓低頻壓力、人聲中心和結像保持一致，而不是每次腔體移動就改變。","安定したフィットは、シェルが動くたびに変わるのではなく、低域の圧力、ボーカルのセンター、イメージングを一定に保ちます。","안정적인 핏은 셸이 움직일 때마다 변하는 대신, 저음 압력, 보컬 중심, 이미징을 일관되게 유지합니다."],
  ["Who it is for","适用人群","適用人群","対象リスナー","대상 청취자"],
  ["Listeners who want reference clarity, real low-end presence, stage-ready stability, and comfort through long sessions.","追求参考级清晰度、真正低频存在感、舞台级稳定性以及长时间佩戴舒适的听众。","追求參考級清晰度、真正低頻存在感、舞台級穩定性以及長時間佩戴舒適的聽眾。","リファレンスクラスの明瞭さ、リアルな低域の存在感、ステージ対応の安定性、長時間の快適さを求めるリスナー。","레퍼런스급 선명도, 진정한 저음 존재감, 스테이지 준비된 안정성, 장시간 청취의 편안함을 원하는 청취자."],
  ["Direct sound path","直接声学路径","直接聲學路徑","ダイレクトサウンドパス","직접 사운드 경로"],
  ["A tube-free, filter-free chamber keeps the route from driver to ear cleaner.","无导管、无阻尼网的腔体让从单元到耳朵的路径更干净。","無導管、無阻尼網的腔體讓從單體到耳朵的路徑更乾淨。","チューブレス・フィルターレスのチャンバーが、ドライバーから耳への経路をよりクリーンに保ちます。","튜브리스, 필터 프리 챔버가 드라이버에서 귀까지의 경로를 더 깔끔하게 유지합니다."],
  ["Precision aluminium core","精密铝制核心","精密鋁製核心","精密アルミニウムコア","정밀 알루미늄 코어"],
  ["A precision aluminium core gives the drivers a calmer base for cleaner notes and steadier imaging.","精密铝制核心为单元提供了更稳定的基底，从而实现更干净的音符和更稳固的结像。","精密鋁製核心為單體提供了更穩定的基底，從而實現更乾淨的音符和更穩固的結像。","精密アルミニウムコアはドライバーにより静かな基盤を提供し、よりクリーンなノートとより安定したイメージングを実現します。","정밀 알루미늄 코어는 드라이버에 더 조용한 기반을 제공하여 더 깔끔한 음표와 더 안정적인 이미징을 실현합니다."],
  ["FitMorph system","FitMorph 系统","FitMorph 系統","FitMorph システム","FitMorph 시스템"],
  ["Switch between shark-fin stability, cleaner compact fit, and optional custom outer-ear lock-in.","在鲨鱼鳍稳固式、更干净的紧凑佩戴式以及可选的外耳定制锁定式之间切换。","在鯊魚鰭穩固式、更乾淨的緊湊佩戴式以及可選的外耳客製鎖定式之間切換。","シャークフィン安定型、すっきりコンパクトフィット、オプションのカスタム外耳固定を切り替え可能。","샤크핀 안정형, 깔끔한 콤팩트 핏, 선택형 맞춤 외이 고정 간 전환."],
  ["Secure 2-pin connection","稳固的 2-pin 连接","穩固的 2-pin 連接","確実な 2ピン接続","안정적인 2핀 연결"],
  ["The 0.78mm 2-pin connection sits within the FitMorph fit system, so cable swaps feel secure over years of use.","0.78mm 2-pin 接口位于 FitMorph 佩戴系统内部，确保线材更换在多年使用中依然稳固可靠。","0.78mm 2-pin 接口位於 FitMorph 佩戴系統內部，確保線材更換在多年使用中依然穩固可靠。","0.78mm 2ピンコネクタは FitMorph フィットシステム内に配置されているため、長年にわたるケーブル交換でも安心感があります。","0.78mm 2핀 커넥터는 FitMorph 핏 시스템 내에 위치하여 수년간 사용해도 케이블 교체가 안심됩니다."],
  ["At a glance","一目了然","一目瞭然","ひと目でわかる","한눈에 보기"],
  ["What makes Z07 work","Z07 的核心构造","Z07 的核心構造","Z07 を支える要素","Z07을 작동하게 만드는 요소"],
  ["AAW | Z07","AAW | Z07","AAW | Z07","AAW | Z07","AAW | Z07"],
  ["10mm titanium dynamic driver, six balanced armatures, true 3-way crossover, FitMorph adaptive fit","10mm 钛金属动圈、六枚动铁、真正三路分频、FitMorph 自适应佩戴","10mm 鈦金屬動圈、六枚平衡電樞、真正三路分頻、FitMorph 自適應佩戴","10mm チタンダイナミックドライバー、6基の BA、真の3ウェイクロスオーバー、FitMorph アダプティブフィット","10mm 티타늄 다이내믹 드라이버, 6개 BA, 진정한 3웨이 크로스오버, FitMorph 적응형 핏"],
  ["Z07 driver and acoustic architecture","Z07 单元与声学架构","Z07 單體與聲學架構","Z07 ドライバーと音響アーキテクチャ","Z07 드라이버 및 음향 아키텍처"],
  ["1 x 10mm","1 x 10mm","1 x 10mm","1 x 10mm","1 x 10mm"],
  ["Titanium Dynamic Driver","钛金属动圈单元","鈦金屬動圈單體","チタンダイナミックドライバー","티타늄 다이내믹 드라이버"],
  ["4 x","4 x","4 x","4 x","4 x"],
  ["Mid BA Drivers","中频动铁单元","中頻平衡電樞單體","中域 BA ドライバー","중역 BA 드라이버"],
  ["2 x","2 x","2 x","2 x","2 x"],
  ["High BA Drivers","高频动铁单元","高頻平衡電樞單體","高域 BA ドライバー","고역 BA 드라이버"],
  ["Adaptive Fit System","自适应佩戴系统","自適應佩戴系統","アダプティブフィットシステム","적응형 핏 시스템"],
  ["Key Features","核心特性","核心特性","主な特徴","주요 특징"],
  ["Tube-free and filter-free acoustic chamber","无导管、无阻尼网声学腔体","無導管、無阻尼網聲學腔體","チューブレス・フィルターレス音響チャンバー","튜브리스 및 필터 프리 어쿠스틱 챔버"],
  ["7-driver hybrid tuning","七单元混合调音","七單體混合調音","7ドライバー・ハイブリッドチューニング","7드라이버 하이브리드 튜닝"],
  ["True 3-way electronic crossover","真正三路电子分频","真正三路電子分頻","真の3ウェイ・エレクトロニッククロスオーバー","진정한 3웨이 전자식 크로스오버"],
  ["Precision aluminium body","精密铝制腔体","精密鋁製腔體","精密アルミニウムボディ","정밀 알루미늄 바디"],
  ["Secure replaceable 0.78mm 2-pin connection","稳固的可更换 0.78mm 2-pin 接口","穩固的可更換 0.78mm 2-pin 接口","確実な交換式 0.78mm 2ピンコネクタ","안정적인 교체형 0.78mm 2핀 커넥터"],
  ["FitMorph adaptive fit system","FitMorph 自适应佩戴系统","FitMorph 自適應佩戴系統","FitMorph アダプティブフィットシステム","FitMorph 적응형 핏 시스템"],
  ["Sensitivity","灵敏度","靈敏度","感度","감도"],
  ["101dB","101dB","101dB","101dB","101dB"],
  ["Impedance","阻抗","阻抗","インピーダンス","임피던스"],
  ["12 Ohm","12Ω","12Ω","12Ω","12옴"],
  ["Total Harmonic Distortion","总谐波失真","總諧波失真","全高調波歪み","총 고조파 왜곡"],
  ["<0.5%","<0.5%","<0.5%","<0.5%","<0.5%"],
  ["Frequency Response","频率响应","頻率響應","周波数特性","주파수 응답"],
  ["10Hz-40kHz","10Hz-40kHz","10Hz-40kHz","10Hz-40kHz","10Hz-40kHz"],
  ["Crossover","分频","分頻","クロスオーバー","크로스오버"],
  ["True 3-way","真正三路","真正三路","真の3ウェイ","진정한 3웨이"],
  ["Acoustic Design","声学设计","聲學設計","音響設計","음향 설계"],
  ["Tubeless / filter-free","无导管 / 无阻尼网","無導管 / 無阻尼網","チューブレス / フィルターレス","튜브리스 / 필터 프리"],
  ["AAW Z07 exploded view showing FitMorph fit options, ear tip, precision aluminium body, balanced armatures, and tubeless faceplate assembly","AAW Z07 爆炸分解图，展示 FitMorph 佩戴选项、耳塞套、精密铝制腔体、动铁单元及无导管面板组件","AAW Z07 爆炸分解圖，展示 FitMorph 佩戴選項、耳塞套、精密鋁製腔體、平衡電樞單體及無導管面板組件","AAW Z07 分解図。FitMorph フィットオプション、イヤーピース、精密アルミニウムボディ、BA、チューブレスフェイスプレートアセンブリを示す。","AAW Z07 분해도. FitMorph 핏 옵션, 이어팁, 정밀 알루미늄 바디, BA 드라이버, 튜브리스 페이스플레이트 어셈블리 표시."],
  ["Inside Z07.","Z07 内部解析。","Z07 內部解析。","Z07 の内部。","Z07 내부."],
  ["FitMorph fit options, the LiquidMorph tip, titanium dynamic driver, six balanced armatures, precision aluminium body, and tubeless faceplate assembly show how Z07 keeps fit and sound working together.","FitMorph 佩戴选项、LiquidMorph 耳塞套、钛金属动圈、六枚动铁单元、精密铝制腔体以及无导管面板组件，展示了 Z07 如何让佩戴与声音协同工作。","FitMorph 佩戴選項、LiquidMorph 耳塞套、鈦金屬動圈、六枚平衡電樞單體、精密鋁製腔體以及無導管面板組件，展示了 Z07 如何讓佩戴與聲音協同工作。","FitMorph フィットオプション、LiquidMorph イヤーピース、チタンダイナミックドライバー、6基の BA、精密アルミニウムボディ、チューブレスフェイスプレートアセンブリは、Z07 がいかにフィットとサウンドを連携させているかを示しています。","FitMorph 핏 옵션, LiquidMorph 이어팁, 티타늄 다이내믹 드라이버, 6개 BA 드라이버, 정밀 알루미늄 바디, 튜브리스 페이스플레이트 어셈블리는 Z07이 핏과 사운드를 어떻게 함께 작동하게 하는지 보여줍니다."],
  ["Listening Notes","听感笔记","聽感筆記","リスニングノート","청취 노트"],
  ["What you notice when Z07 is in hand","当 Z07 拿在手中时，你会注意到的细节","當 Z07 拿在手中時，你會注意到的細節","Z07 を手に取ったときに気づくこと","Z07을 손에 쥐었을 때 느껴지는 것들"],
  ["A closer look at the pieces that make Z07 different: the precision aluminium body, FitMorph fit system, secure 2-pin connection, LiquidMorph tips, and complete carry kit.","近距离审视那些让 Z07 与众不同的部件：精密铝制腔体、FitMorph 佩戴系统、稳固的 2-pin 接口、LiquidMorph 耳塞套以及完整的便携套装。","近距離審視那些讓 Z07 與眾不同的部件：精密鋁製腔體、FitMorph 佩戴系統、穩固的 2-pin 接口、LiquidMorph 耳塞套以及完整的便攜套裝。","Z07 を他と差別化する部品をクローズアップ。精密アルミニウムボディ、FitMorph フィットシステム、確実な 2ピン接続、LiquidMorph イヤーピース、そして完全なキャリーキット。","Z07을 차별화하는 부품들을 자세히 살펴봅니다. 정밀 알루미늄 바디, FitMorph 핏 시스템, 안정적인 2핀 커넥터, LiquidMorph 이어팁, 완벽한 휴대 키트."],
  ["AAW Z07 green and black faceplate close-up","AAW Z07 绿黑面板特写","AAW Z07 綠黑面板特寫","AAW Z07 グリーン＆ブラック フェイスプレート クローズアップ","AAW Z07 그린 블랙 페이스플레이트 클로즈업"],
  ["Z07 faceplate","Z07 面板","Z07 面板","Z07 フェイスプレート","Z07 페이스플레이트"],
  ["The green ring, open metal grille, and gold hardware give Z07 its instrument-like identity.","绿色圆环、开放式金属网罩和金色硬件赋予 Z07 乐器般的质感。","綠色圓環、開放式金屬網罩和金色硬體賦予 Z07 樂器般的質感。","グリーンリング、オープンメタルグリル、ゴールドハードウェアが、Z07 に楽器のようなアイデンティティを与えています。","그린 링, 오픈 메탈 그릴, 골드 하드웨어가 Z07에 악기 같은 정체성을 부여합니다."],
  ["LiquidMorph clear ear tips with teal inner bore for AAW Z07","适用于 AAW Z07 的 LiquidMorph 透明耳塞套，青绿色内管","適用於 AAW Z07 的 LiquidMorph 透明耳塞套，青綠色內管","AAW Z07 用 LiquidMorph クリアイヤーピース（ティール内管）","AAW Z07용 LiquidMorph 투명 이어팁 (청록색 내부 보어)"],
  ["LiquidMorph tips","LiquidMorph 耳塞套","LiquidMorph 耳塞套","LiquidMorph イヤーピース","LiquidMorph 이어팁"],
  ["The canal seal stays silicone-based even when the outer-ear support is customized.","即使外耳支撑部分被定制，耳道密封仍由硅胶材料保证。","即使外耳支撐部分被客製，耳道密封仍由矽膠材料保證。","外耳サポートをカスタマイズしても、耳道の密閉はシリコンベースのままです。","외이 서포트를 맞춤 제작해도 이도 밀착은 실리콘 기반으로 유지됩니다."],
  ["AAW Z07 with cable and 4.4mm balanced plug","配有线材和 4.4mm 平衡插头的 AAW Z07","配有線材和 4.4mm 平衡插頭的 AAW Z07","ケーブルと 4.4mm バランスプラグを備えた AAW Z07","케이블 및 4.4mm 밸런스드 플러그가 포함된 AAW Z07"],
  ["Source-ready cable","即插即用线材","即插即用線材","ソースレディケーブル","소스 레디 케이블"],
  ["A familiar 2-pin connection keeps Z07 flexible across portable and balanced sources.","常见的 2-pin 接口让 Z07 在便携和平衡音源之间灵活切换。","常見的 2-pin 接口讓 Z07 在便攜和平衡音源之間靈活切換。","おなじみの 2ピンコネクタにより、Z07 はポータブルソースとバランスソースの間で柔軟に使用できます。","익숙한 2핀 커넥터는 Z07을 포터블 및 밸런스드 소스 간에 유연하게 사용할 수 있게 합니다."],
  ["Consistent Fit, Consistent Sound","佩戴一致，声音一致","佩戴一致，聲音一致","一貫したフィット、一貫したサウンド","일관된 핏, 일관된 사운드"],
  ["Same Z07 tuning, whichever fit you choose","无论选择哪种佩戴方式，Z07 的调音始终如一","無論選擇哪種佩戴方式，Z07 的調音始終如一","どのフィットを選んでも、同じ Z07 チューニング","어떤 핏을 선택하든 동일한 Z07 튜닝"],
  ["Different shell shapes and canal angles can change what you hear. Z07 keeps the same tuning across its FitMorph options, so the sound you fall for is the sound you can keep enjoying.","不同的腔体形状和入耳角度会影响你听到的声音。Z07 在所有 FitMorph 选项中保持相同的调音，因此你最初喜欢的声音，可以一直享受下去。","不同的腔體形狀和入耳角度會影響你聽到的聲音。Z07 在所有 FitMorph 選項中保持相同的調音，因此你最初喜歡的聲音，可以一直享受下去。","異なるシェル形状や耳道角度は、聴こえを変える可能性があります。Z07 は FitMorph オプション全体で同じチューニングを維持するため、あなたが気に入ったサウンドをそのまま楽しみ続けられます。","다른 셸 모양과 이도 각도는 들리는 소리를 바꿀 수 있습니다. Z07은 FitMorph 옵션 전반에 걸쳐 동일한 튜닝을 유지하므로, 처음에 반한 사운드를 계속해서 즐길 수 있습니다."],
  ["Person wearing AAW Z07 universal in-ear monitor with over-ear cable","佩戴 AAW Z07 通用型入耳式监听耳机（绕耳式线材）的人","佩戴 AAW Z07 通用型入耳式監聽耳機（繞耳式線材）的人","耳掛けケーブルを装着した AAW Z07 ユニバーサル IEM を着用する人物","오버이어 케이블을 착용한 AAW Z07 유니버설 IEM 착용자"],
  ["Real-world fit check","真实佩戴展示","真實佩戴展示","実環境でのフィットチェック","실제 착용 모습"],
  ["The canal still seals with LiquidMorph tips, while FitMorph adjusts the outer support around your ear.","耳道仍由 LiquidMorph 耳塞套密封，而 FitMorph 则调节你耳廓周围的外耳支撑。","耳道仍由 LiquidMorph 耳塞套密封，而 FitMorph 則調節你耳廓周圍的外耳支撐。","耳道は引き続き LiquidMorph イヤーピースで密閉され、FitMorph は耳の周りの外耳サポートを調整します。","이도는 여전히 LiquidMorph 이어팁으로 밀착되고, FitMorph는 귀 주변의 외이 서포트를 조정합니다."],
  ["Audition with confidence","放心试听","放心試聽","安心して試聴できる","자신 있게 청음"],
  ["The same Z07 tuning follows you whether you choose shark-fin, finless, or optional custom outer-ear support.","无论你选择鲨鱼鳍式、无鳍式还是可选的外耳定制支撑，Z07 的调音始终不变。","無論你選擇鯊魚鰭式、無鰭式還是可選的外耳客製支撐，Z07 的調音始終不變。","シャークフィン、フィンレス、またはオプションのカスタム外耳サポートのいずれを選んでも、同じ Z07 チューニングが付いてきます。","샤크핀, 핀리스, 또는 선택형 맞춤 외이 서포트 중 어떤 것을 선택하든 동일한 Z07 튜닝이 적용됩니다."],
  ["Keep the silicone seal","保持硅胶密封","保持矽膠密封","シリコンシールを維持","실리콘 밀착 유지"],
  ["The ear tip still handles the canal seal, so custom outer-ear support changes how Z07 rests in the ear rather than changing the sound you chose.","耳塞套依然负责耳道密封，因此定制外耳支撑改变的是 Z07 在耳内的贴合方式，而非你选择的音质。","耳塞套依然負責耳道密封，因此客製外耳支撐改變的是 Z07 在耳內的貼合方式，而非你選擇的音質。","イヤーピースが引き続き耳道の密閉を担当するため、カスタム外耳サポートは Z07 の耳への収まり方を変えるだけで、選んだサウンドを変えることはありません。","이어팁이 계속해서 이도 밀착을 담당하므로, 맞춤형 외이 서포트는 Z07이 귀에 안착하는 방식을 바꿀 뿐 선택한 사운드는 바꾸지 않습니다."],
  ["Less fit anxiety","减少佩戴焦虑","減少佩戴焦慮","フィットの不安を軽減","핏 불안감 감소"],
  ["If one fit option feels wrong, Z07 gives you another fit route before you give up on the sound.","如果一种佩戴方式感觉不对，Z07 会在你放弃其声音之前，给你另一种佩戴选择。","如果一種佩戴方式感覺不對，Z07 會在你放棄其聲音之前，給你另一種佩戴選擇。","あるフィットオプションが合わないと感じても、Z07 はサウンドを諦める前に別のフィット経路を提供します。","한 가지 핏 옵션이 맞지 않는다고 느껴져도, Z07은 사운드를 포기하기 전에 다른 핏 경로를 제공합니다."],
  ["Craft & Sound","工艺与声音","工藝與聲音","クラフト & サウンド","공예와 사운드"],
  ["A steadier sound for longer sessions","长时间聆听下的更稳定声音","長時間聆聽下的更穩定聲音","長時間リスニングでも安定したサウンド","장시간 청취에도 안정적인 사운드"],
  ["Z07 uses a precision-machined aluminium body to keep its seven drivers working from the same stable base. The result is a monitor that keeps bass, vocals, and treble organized when the mix gets dense and the session gets long.","Z07 采用精密加工的铝制腔体，使其七个单元在同一稳定基底上工作。结果是：当混音变得密集、聆听时间变长时，耳机依然能让低频、人声和高频井然有序。","Z07 採用精密加工的鋁製腔體，使其七個單體在同一穩定基底上工作。結果是：當混音變得密集、聆聽時間變長時，耳機依然能讓低頻、人聲和高頻井井有條。","Z07 は精密機械加工されたアルミニウムボディを採用し、7つのドライバーを同じ安定した基盤で動作させます。その結果、ミックスが密集し、セッションが長くなっても、低域、ボーカル、高域を整理整頓された状態に保つモニターが実現します。","Z07은 정밀 가공된 알루미늄 바디를 사용하여 7개의 드라이버가 동일한 안정적인 기반에서 작동하도록 합니다. 그 결과, 믹스가 빽빽해지고 청취 시간이 길어져도 저음, 보컬, 고음을 체계적으로 유지하는 모니터가 탄생했습니다."],
  ["The 0.78mm 2-pin connection sits within the FitMorph fit system, giving Z07 a reassuring cable feel for everyday use. For the listener, that means fewer worries when swapping cables or carrying the monitor between sources.","0.78mm 2-pin 接口位于 FitMorph 佩戴系统内部，为日常使用提供令人放心的线材手感。对听众而言，这意味着在更换线材或在音源间切换时更少担忧。","0.78mm 2-pin 接口位於 FitMorph 佩戴系統內部，為日常使用提供令人放心的線材手感。對聽眾而言，這意味著在更換線材或在音源間切換時更少擔憂。","0.78mm 2ピンコネクタが FitMorph フィットシステム内に配置されていることで、Z07 は日常使いで安心感のあるケーブルフィールを提供します。リスナーにとっては、ケーブル交換や音源間でのモニターの持ち運びの際の心配が減ります。","0.78mm 2핀 커넥터가 FitMorph 핏 시스템 내에 위치하여 일상 사용에 안심감 있는 케이블 느낌을 줍니다. 청취자에게는 케이블 교체나 소스 간 모니터 이동 시 걱정이 줄어듭니다."],
  ["AAW Z07 industrial design sketch of the FitMorph monitor body","AAW Z07 FitMorph 腔体工业设计草图","AAW Z07 FitMorph 腔體工業設計草圖","AAW Z07 FitMorph モニターボディの工業デザインスケッチ","AAW Z07 FitMorph 모니터 바디 산업 디자인 스케치"],
  ["FitMorph helps Z07 feel settled first, so the music can take over without constant readjustment.","FitMorph 帮助 Z07 首先获得稳定贴合，从而让音乐接管一切，无需反复调整。","FitMorph 幫助 Z07 首先獲得穩定貼合，從而讓音樂接管一切，無需反覆調整。","FitMorph は Z07 をまず落ち着かせ、絶え間ない再調整なしに音楽に没頭できるようにします。","FitMorph는 Z07을 먼저 안정시키고, 끊임없는 재조정 없이 음악에 집중할 수 있게 합니다."],
  ["Format","类型","類型","形式","형태"],
  ["Universal-fit tubeless hybrid IEM","通用型无导管混合入耳式耳机","通用型無導管混合入耳式耳機","ユニバーサルフィット・チューブレスハイブリッド IEM","유니버설 핏 튜브리스 하이브리드 IEM"],
  ["Driver configuration","单元配置","單體配置","ドライバー構成","드라이버 구성"],
  ["1 dynamic + 6 balanced armatures","1 动圈 + 6 动铁","1 動圈 + 6 平衡電樞","1 ダイナミック + 6 BA","1 다이내믹 + 6 BA"],
  ["Low end","低频","低頻","低域","저역"],
  ["10mm titanium diaphragm dynamic driver","10mm 钛振膜动圈单元","10mm 鈦振膜動圈單體","10mm チタン振動板ダイナミックドライバー","10mm 티타늄 진동판 다이내믹 드라이버"],
  ["Body","腔体","腔體","ボディ","바디"],
  ["Precision aluminium construction","精密铝制结构","精密鋁製結構","精密アルミニウム構造","정밀 알루미늄 구조"],
  ["Connection","接口","接口","コネクタ","커넥터"],
  ["Secure 0.78mm 2-pin design","稳固的 0.78mm 2-pin 设计","穩固的 0.78mm 2-pin 設計","確実な 0.78mm 2ピン設計","안정적인 0.78mm 2핀 설계"],
  ["Warranty","保修","保固","保証","보증"],
  ["1-year warranty against manufacturing defects","1 年保修（制造缺陷）","1 年保固（製造缺陷）","製造上の欠陥に対する 1 年保証","제조상 결함에 대한 1년 보증"],
  ["Signal Chain Ready","信号链就绪","訊號鏈就緒","シグナルチェーン対応済み","시그널 체인 준비 완료"],
  ["Ready for the sources you actually use","为你日常使用的音源做好准备","為你日常使用的音源做好準備","実際に使うソースに対応済み","실제로 사용하는 소스에 대비"],
  ["Z07 ships ready for analog listening: swap between 3.5mm single-ended and 4.4mm balanced terminations for portable players, dongles, DAPs, and desktop DAC/amps. Its 12 Ohm impedance and 101dB sensitivity pair best with low-output-impedance sources for clean daily listening.","Z07 出厂即支持模拟聆听：可在 3.5mm 单端和 4.4mm 平衡插头之间切换，适配便携播放器、小尾巴、DAP 和桌面 DAC/耳放。其 12Ω 阻抗和 101dB 灵敏度最适合搭配低输出阻抗音源，实现干净日常聆听。","Z07 出廠即支援類比聆聽：可在 3.5mm 單端和 4.4mm 平衡插頭之間切換，適配便攜播放器、小尾巴、DAP 和桌面 DAC/耳擴。其 12Ω 阻抗和 101dB 靈敏度最適合搭配低輸出阻抗音源，實現乾淨日常聆聽。","Z07 はアナログリスニングに対応して出荷されます。3.5mm シングルエンドと 4.4mm バランス端子を、ポータブルプレーヤー、ドングル、DAP、デスクトップ DAC/アンプ用に交換可能。12Ω のインピーダンスと 101dB の感度は、低出力インピーダンスのソースと最も相性が良く、クリーンな日常リスニングを実現します。","Z07은 아날로그 청취를 지원하는 상태로 출하됩니다. 3.5mm 싱글엔드 및 4.4mm 밸런스드 단자를 포터블 플레이어, 동글, DAP, 데스크톱 DAC/앰프에 맞게 교체할 수 있습니다. 12옴 임피던스와 101dB 감도는 낮은 출력 임피던스 소스와 가장 잘 어울려 깔끔한 일상 청취를 제공합니다."],
  ["AAW Z07 complete kit with carrying case, cable, 3.5mm and 4.4mm terminations, and monitors","AAW Z07 完整套装：包含收纳盒、线材、3.5mm 和 4.4mm 插头、耳机本体","AAW Z07 完整套裝：包含收納盒、線材、3.5mm 和 4.4mm 插頭、耳機本體","AAW Z07 コンプリートキット。キャリングケース、ケーブル、3.5mm / 4.4mm プラグ、IEM が含まれます。","AAW Z07 컴플리트 키트: 케이스, 케이블, 3.5mm 및 4.4mm 단자, 모니터 포함"],
  ["Z07 ships with a protective case, cable, and swappable 3.5mm / 4.4mm terminations for daily listening.","Z07 出厂附带保护盒、线材以及可更换的 3.5mm / 4.4mm 插头，满足日常聆听需求。","Z07 出廠附帶保護盒、線材以及可更換的 3.5mm / 4.4mm 插頭，滿足日常聆聽需求。","Z07 には、日常リスニング用のプロテクティブケース、ケーブル、交換可能な 3.5mm / 4.4mm プラグが付属します。","Z07에는 일상 청취를 위한 보호 케이스, 케이블, 교체 가능한 3.5mm / 4.4mm 단자가 함께 제공됩니다."],
  ["Cable terminations","线材插头","線材插頭","ケーブルプラグ","케이블 단자"],
  ["Interchangeable 3.5mm single-ended and 4.4mm balanced plugs are included.","包含可互换的 3.5mm 单端和 4.4mm 平衡插头。","包含可互換的 3.5mm 單端和 4.4mm 平衡插頭。","交換可能な 3.5mm シングルエンドと 4.4mm バランスプラグが付属します。","교체 가능한 3.5mm 싱글엔드 및 4.4mm 밸런스드 플러그가 포함됩니다."],
  ["Recommended source","推荐音源","推薦音源","推奨ソース","권장 소스"],
  ["Low-output-impedance portable player, dongle, DAP, or desktop DAC/amp.","低输出阻抗的便携播放器、小尾巴、DAP 或桌面 DAC/耳放。","低輸出阻抗的便攜播放器、小尾巴、DAP 或桌面 DAC/耳擴。","低出力インピーダンスのポータブルプレーヤー、ドングル、DAP、またはデスクトップ DAC/アンプ。","낮은 출력 임피던스의 포터블 플레이어, 동글, DAP 또는 데스크톱 DAC/앰프."],
  ["IEM connection","耳机接口","耳機接口","IEM コネクタ","IEM 커넥터"],
  ["0.78mm 2-pin connection through the FitMorph fit system.","通过 FitMorph 佩戴系统的 0.78mm 2-pin 接口。","透過 FitMorph 佩戴系統的 0.78mm 2-pin 接口。","FitMorph フィットシステムによる 0.78mm 2ピン接続。","FitMorph 핏 시스템을 통한 0.78mm 2핀 커넥터."],
  ["Carry case","收纳盒","收納盒","キャリングケース","휴대용 케이스"],
  ["Protective case for daily transport and long-term storage.","便于日常携带和长期存放的保护盒。","便於日常攜帶和長期存放的保護盒。","日常の持ち運びと長期保管のためのプロテクティブケース。","일상 운반 및 장기 보관을 위한 보호 케이스."],
  ["Built by Advanced AcousticWerkes","由 Advanced AcousticWerkes 打造","由 Advanced AcousticWerkes 打造","Advanced AcousticWerkes による設計・製造","Advanced AcousticWerkes 제작"],
  ["Singapore IEM craft, shaped by listening","新加坡 IEM 工艺，由聆听塑造","新加坡 IEM 工藝，由聆聽塑造","リスニングによって形作られる、シンガポールの IEM クラフト","청취를 통해 형성된 싱가포르 IEM 공예"],
  ["Advanced AcousticWerkes, known as AAW, is a Singapore-based in-ear monitor specialist founded in 2014 by Kevin Wang. From custom IEM work to hybrid, electrostatic, planar, isobaric, and modular-fit designs, AAW works around one principle: every monitor has to prove itself through listening.","Advanced AcousticWerkes，简称 AAW，是一家总部位于新加坡的入耳式监听耳机专业品牌，由 Kevin Wang 于 2014 年创立。从定制 IEM 到混合、静电、平板、等压及模块化佩戴设计，AAW 始终围绕一个原则：每一副耳机都必须通过聆听来证明自己。","Advanced AcousticWerkes，簡稱 AAW，是一家總部位於新加坡的入耳式監聽耳機專業品牌，由 Kevin Wang 於 2014 年創立。從客製 IEM 到混合、靜電、平板、等壓及模組化佩戴設計，AAW 始終圍繞一個原則：每一副耳機都必須透過聆聽來證明自己。","Advanced AcousticWerkes（AAW）は、Kevin Wang によって 2014 年に設立されたシンガポール拠点の IEM 専門ブランドです。カスタム IEM から、ハイブリッド、静電、平面磁界、アイソバリック、モジュラーフィット設計に至るまで、AAW は「すべてのモニターはリスニングによってその実力を証明しなければならない」という原則を掲げています。","Advanced AcousticWerkes, 즉 AAW는 Kevin Wang이 2014년에 설립한 싱가포르 기반 IEM 전문 브랜드입니다. 커스텀 IEM 작업부터 하이브리드, 정전형, 평판형, 아이소배릭, 모듈러 핏 설계에 이르기까지 AAW는 하나의 원칙을 따릅니다. 모든 모니터는 청취를 통해 입증되어야 합니다."],
  ["Z07 continues that line with FitMorph adaptive fit, a tubeless chamber, a precision aluminium body, and a tuning goal that balances reference clarity with real low-end authority.","Z07 延续了这一路线，配备了 FitMorph 自适应佩戴、无导管腔体、精密铝制腔体，以及一个平衡参考级清晰度与真实低频权威感的调音目标。","Z07 延續了這一路線，配備了 FitMorph 自適應佩戴、無導管腔體、精密鋁製腔體，以及一個平衡參考級清晰度與真實低頻權威感的調音目標。","Z07 はこの路線を継承し、FitMorph アダプティブフィット、チューブレスチャンバー、精密アルミニウムボディ、そしてリファレンスクラスの明瞭さとリアルな低域の支配力を両立させるチューニング目標を備えています。","Z07은 FitMorph 적응형 핏, 튜브리스 챔버, 정밀 알루미늄 바디, 그리고 레퍼런스 선명도와 실제 저음 권위감의 균형을 맞추는 튜닝 목표를 갖추며 이 계보를 이어갑니다."],
  ["About Us","关于我们","關於我們","会社概要","회사 소개"],
  ["Where to buy","购买渠道","購買渠道","購入方法","구매처"],
  ["Hear AAW in Singapore and beyond","在新加坡及全球聆听 AAW","在新加坡及全球聆聽 AAW","シンガポールと世界で AAW を聴く","싱가포르와 해외에서 AAW 청음"],
  ["Advanced AcousticWerkes is based in Singapore. To audition Z07, arrange support, or find a dealer, start with AAW Singapore or one of the listening rooms below.","Advanced AcousticWerkes 总部位于新加坡。如需试听 Z07、获取支持或寻找经销商，请从 AAW Singapore 或以下聆听空间开始。","Advanced AcousticWerkes 總部位於新加坡。如需試聽 Z07、獲取支援或尋找經銷商，請從 AAW Singapore 或以下聆聽空間開始。","Advanced AcousticWerkes はシンガポールに拠点を置いています。Z07 の試聴、サポートの手配、販売店をお探しの際は、AAW Singapore または下記のリスニングスポットからお問い合わせください。","Advanced AcousticWerkes는 싱가포르에 기반을 두고 있습니다. Z07 청음, 지원, 딜러 문의는 AAW Singapore 또는 아래 리스닝 공간에서 시작하세요."],
  ["Singapore locations","新加坡地点","新加坡地點","シンガポール拠点","싱가포르 지점"],
  ["AAW Office","AAW 办公室","AAW 辦公室","AAW オフィス","AAW 오피스"],
  ["#01-03, 76 Playfair Rd, Singapore 367996","76 Playfair Rd #01-03, Singapore 367996","76 Playfair Rd #01-03, Singapore 367996","76 Playfair Rd #01-03, Singapore 367996","76 Playfair Rd #01-03, Singapore 367996"],
  ["PH: +65 8731 5476","电话：+65 8731 5476","電話：+65 8731 5476","電話：+65 8731 5476","전화: +65 8731 5476"],
  ["Email: support@aaw.me","邮箱：support@aaw.me","信箱：support@aaw.me","メール：support@aaw.me","이메일: support@aaw.me"],
  ["Hours: Monday, Wednesday, Thursday, Friday 10:00 AM-6:00 PM. Tuesday and Saturday by appointment. Sunday closed.","营业时间：周一、周三、周四、周五 10:00–18:00；周二、周六需预约；周日休息。","營業時間：週一、週三、週四、週五 10:00–18:00；週二、週六需預約；週日休息。","営業時間：月・水・木・金 10:00～18:00。火・土は予約制。日曜定休。","운영 시간: 월요일, 수요일, 목요일, 금요일 오전 10:00~오후 6:00. 화요일과 토요일은 예약제. 일요일 휴무."],
  ["Singapore dealer","新加坡经销商","新加坡經銷商","シンガポール販売店","싱가포르 딜러"],
  ["Zeppelin & Co.","Zeppelin & Co.","Zeppelin & Co.","Zeppelin & Co.","Zeppelin & Co."],
  ["1 Rochor Canal Rd, #02-78 Sim Lim Square, Singapore 188504","1 Rochor Canal Rd #02-78 Sim Lim Square, Singapore 188504","1 Rochor Canal Rd #02-78 Sim Lim Square, Singapore 188504","1 Rochor Canal Rd #02-78 Sim Lim Square, Singapore 188504","1 Rochor Canal Rd #02-78 Sim Lim Square, Singapore 188504"],
  ["PH: 9337 9655","电话：9337 9655","電話：9337 9655","電話：9337 9655","전화: 9337 9655"],
  ["Hours: Daily 11:30 AM-8:00 PM; Sunday 12:00 PM-7:00 PM.","营业时间：每日 11:30–20:00；周日 12:00–19:00。","營業時間：每日 11:30–20:00；週日 12:00–19:00。","営業時間：毎日 11:30～20:00。日曜 12:00～19:00。","운영 시간: 매일 오전 11:30~오후 8:00; 일요일 오후 12:00~오후 7:00."],
  ["JABEN","JABEN","JABEN","JABEN","JABEN"],
  ["1 Coleman St, #01-25 The Adelphi, Singapore 179803","1 Coleman St #01-25 The Adelphi, Singapore 179803","1 Coleman St #01-25 The Adelphi, Singapore 179803","1 Coleman St #01-25 The Adelphi, Singapore 179803","1 Coleman St #01-25 The Adelphi, Singapore 179803"],
  ["PH: 6337 0809","电话：6337 0809","電話：6337 0809","電話：6337 0809","전화: 6337 0809"],
  ["Hours: Daily 12:00 PM-8:00 PM.","营业时间：每日 12:00–20:00。","營業時間：每日 12:00–20:00。","営業時間：毎日 12:00～20:00。","운영 시간: 매일 오후 12:00~오후 8:00."],
  ["AV One","AV One","AV One","AV One","AV One"],
  ["1 Coleman St, The Adelphi, Singapore 179803","1 Coleman St The Adelphi, Singapore 179803","1 Coleman St The Adelphi, Singapore 179803","1 Coleman St The Adelphi, Singapore 179803","1 Coleman St The Adelphi, Singapore 179803"],
  ["PH: 6337 0080","电话：6337 0080","電話：6337 0080","電話：6337 0080","전화: 6337 0080"],
  ["Hours: Monday-Saturday 11:00 AM-7:30 PM; Sunday 1:00 PM-6:00 PM.","营业时间：周一至周六 11:00–19:30；周日 13:00–18:00。","營業時間：週一至週六 11:00–19:30；週日 13:00–18:00。","営業時間：月～土 11:00～19:30、日 13:00～18:00。","운영 시간: 월요일~토요일 오전 11:00~오후 7:30; 일요일 오후 1:00~오후 6:00."],
  ["Global listening rooms","全球聆听空间","全球聆聽空間","世界のリスニングスポット","글로벌 리스닝 공간"],
  ["Outside Singapore, AAW works with specialist audio stores across Hong Kong, Macau, Japan, China, South Korea, and Thailand, including DMA, Fine Up Computer, Let's Go Audio, Music Movie Driver, e-earphone, Step Sound, Sorishop, and SoundProofBros.","在新加坡以外，AAW 与香港、澳门、日本、中国大陆、韩国及泰国的专业音频店合作，包括 DMA、Fine Up Computer、Let's Go Audio、Music Movie Driver、e-earphone、Step Sound、Sorishop 和 SoundProofBros。","在新加坡以外，AAW 與香港、澳門、日本、中國大陸、韓國及泰國的專業音頻店合作，包括 DMA、Fine Up Computer、Let's Go Audio、Music Movie Driver、e-earphone、Step Sound、Sorishop 和 SoundProofBros。","シンガポール以外では、AAW は香港、マカオ、日本、中国、韓国、タイの専門オーディオストアと連携しています。DMA、Fine Up Computer、Let's Go Audio、Music Movie Driver、e-earphone、Step Sound、Sorishop、SoundProofBros などです。","싱가포르 외 지역에서 AAW는 홍콩, 마카오, 일본, 중국, 한국, 태국의 전문 오디오 매장과 협력하고 있습니다. DMA, Fine Up Computer, Let's Go Audio, Music Movie Driver, e-earphone, Step Sound, Sorishop, SoundProofBros 등이 포함됩니다."],
  ["Find a listening room","查找聆听空间","查找聆聽空間","リスニングスポットを探す","리스닝 공간 찾기"],
  ["FAQ","常见问题","常見問題","よくある質問","FAQ"],
  ["Frequently asked questions about Z07","Z07 常见问题","Z07 常見問題","Z07 に関するよくある質問","Z07 자주 묻는 질문"],
  ["A short version for listeners comparing Z07 with conventional hybrid IEMs, stage monitors, and adaptive-fit systems.","为那些将 Z07 与传统混合 IEM、舞台监听及自适应佩戴系统进行比较的听众准备的简短版本。","為那些將 Z07 與傳統混合 IEM、舞台監聽及自適應佩戴系統進行比較的聽眾準備的簡短版本。","Z07 を従来型のハイブリッド IEM、ステージモニター、アダプティブフィットシステムと比較するリスナーのための短いまとめ。","Z07을 기존 하이브리드 IEM, 스테이지 모니터, 적응형 핏 시스템과 비교하는 청취자를 위한 짧은 버전."],
  ["What makes Z07 different from a conventional hybrid IEM?","Z07 与传统混合 IEM 有何不同？","Z07 與傳統混合 IEM 有何不同？","Z07 は従来のハイブリッド IEM と何が違うのですか？","Z07은 기존 하이브리드 IEM과 어떻게 다른가요?"],
  ["Z07 uses a tube-free, filter-free acoustic chamber instead of routing sound through long tubes and dampers. A true 3-way crossover helps the seven drivers blend cleanly, so bass, vocals, and treble arrive with better focus and less haze.","Z07 采用无导管、无阻尼网的声学腔体，而非通过长导管和阻尼器传输声音。真正的三路分频帮助七个单元干净地融合，使低频、人声和高频以更好的聚焦和更少的朦胧感呈现。","Z07 採用無導管、無阻尼網的聲學腔體，而非透過長導管和阻尼器傳輸聲音。真正的三路分頻幫助七個單體乾淨地融合，使低頻、人聲和高頻以更好的聚焦和更少的朦朧感呈現。","Z07 は、長いチューブやダンパーを通さず、チューブレス・フィルターレスの音響チャンバーを採用しています。真の3ウェイクロスオーバーにより、7つのドライバーがクリーンにブレンドされ、低域、ボーカル、高域がより良いフォーカスと少ない曇りで届きます。","Z07은 긴 튜브와 댐퍼를 통하지 않는 튜브리스, 필터 프리 어쿠스틱 챔버를 사용합니다. 진정한 3웨이 크로스오버는 7개의 드라이버가 깔끔하게 혼합되도록 도와 저음, 보컬, 고음이 더 나은 포커스와 적은 안개로 전달되게 합니다."],
  ["Why does fit matter so much for Z07?","为什么佩戴对 Z07 如此重要？","為什麼佩戴對 Z07 如此重要？","Z07 にとってフィットはなぜそれほど重要なのですか？","Z07에서 핏이 왜 그렇게 중요한가요?"],
  ["Fit affects what you hear. A stable seal helps Z07 keep its intended bass pressure, center image, and stage focus. FitMorph gives listeners multiple outer-fit options so the monitor can settle faster before the sound is judged.","佩戴会影响你所听到的声音。稳定的密封有助于 Z07 保持其预期的低频压力、中心结像和舞台聚焦。FitMorph 为听众提供多种外耳佩戴选项，让耳机在评估声音之前更快稳定下来。","佩戴會影響你所聽到的聲音。穩定的密封有助於 Z07 保持其預期的低頻壓力、中心結像和舞台聚焦。FitMorph 為聽眾提供多種外耳佩戴選項，讓耳機在評估聲音之前更快穩定下來。","フィットは聴こえに影響します。安定した密閉は、Z07 が意図された低域の圧力、センターイメージ、ステージフォーカスを維持するのに役立ちます。FitMorph はリスナーに複数の外耳フィットオプションを提供し、サウンドを評価する前にモニターをより早く安定させることができます。","핏은 청취에 영향을 미칩니다. 안정적인 밀착감은 Z07이 의도된 저음 압력, 중앙 이미징, 스테이지 포커스를 유지하도록 돕습니다. FitMorph는 청취자에게 여러 외이 핏 옵션을 제공하여 사운드를 판단하기 전에 모니터가 더 빨리 안정될 수 있게 합니다."],
  ["What is FitMorph?","什么是 FitMorph？","什麼是 FitMorph？","FitMorph とは何ですか？","FitMorph란 무엇인가요?"],
  ["FitMorph is AAW's adaptive fit system for Z07. The same Z07 tuning works across interchangeable FitMorph options, letting the listener choose shark-fin stability, a cleaner compact fit, or optional custom outer-ear support.","FitMorph 是 AAW 为 Z07 设计的自适应佩戴系统。相同的 Z07 调音适用于所有可互换的 FitMorph 选项，让听众可以选择鲨鱼鳍式稳固、更干净的紧凑佩戴，或者可选的外耳定制支撑。","FitMorph 是 AAW 為 Z07 設計的自適應佩戴系統。相同的 Z07 調音適用於所有可互換的 FitMorph 選項，讓聽眾可以選擇鯊魚鰭式穩固、更乾淨的緊湊佩戴，或者可選的外耳客製支撐。","FitMorph は AAW の Z07 向けアダプティブフィットシステムです。同じ Z07 チューニングが交換可能な FitMorph オプション全体で機能し、リスナーはシャークフィン安定型、すっきりコンパクトフィット、またはオプションのカスタム外耳サポートを選択できます。","FitMorph는 AAW의 Z07용 적응형 핏 시스템입니다. 동일한 Z07 튜닝이 교체 가능한 FitMorph 옵션 전반에 걸쳐 작동하여, 청취자는 샤크핀 안정형, 깔끔한 콤팩트 핏, 또는 선택형 맞춤 외이 서포트를 선택할 수 있습니다."],
  ["Will the custom FitMorph fit option change the sound?","定制的 FitMorph 佩戴选项会改变声音吗？","客製的 FitMorph 佩戴選項會改變聲音嗎？","カスタム FitMorph フィットオプションはサウンドを変えますか？","맞춤형 FitMorph 핏 옵션은 사운드를 바꾸나요?"],
  ["The optional custom FitMorph option changes how Z07 rests in the outer ear, not the sound you chose. The canal still seals with LiquidMorph silicone ear tips, so the goal is a more secure fit while keeping the same Z07 tuning.","可选的自定义 FitMorph 选项改变的是 Z07 在外耳中的贴合方式，而非你所选择的声音。耳道仍由 LiquidMorph 硅胶耳塞套密封，因此在保持相同 Z07 调音的同时，获得更稳固的佩戴。","可選的自定義 FitMorph 選項改變的是 Z07 在外耳中的貼合方式，而非你所選擇的聲音。耳道仍由 LiquidMorph 矽膠耳塞套密封，因此在保持相同 Z07 調音的同時，獲得更穩固的佩戴。","オプションのカスタム FitMorph オプションは、Z07 が外耳にどのように収まるかを変えるものであって、あなたが選んだサウンドを変えるものではありません。耳道は引き続き LiquidMorph シリコンイヤーピースで密閉されるため、同じ Z07 チューニングを維持しながら、より確実なフィットを実現することが目標です。","선택형 맞춤 FitMorph 옵션은 Z07이 외이에 안착하는 방식을 바꿀 뿐, 선택한 사운드는 바꾸지 않습니다. 이도는 여전히 LiquidMorph 실리콘 이어팁으로 밀착되므로, 동일한 Z07 튜닝을 유지하면서 더 안정적인 핏을 얻는 것이 목표입니다."],
  ["How many drivers does Z07 use?","Z07 使用了多少个单元？","Z07 使用了多少個單體？","Z07 はいくつのドライバーを使用していますか？","Z07은 몇 개의 드라이버를 사용하나요?"],
  ["Z07 uses seven drivers in total: one 10mm titanium diaphragm dynamic driver for bass and six balanced armatures for midrange, highs, and air.","Z07 总共使用七个单元：一个 10mm 钛振膜动圈单元负责低频，六个动铁单元负责中频、高频和空气感。","Z07 總共使用七個單體：一個 10mm 鈦振膜動圈單體負責低頻，六個平衡電樞單體負責中頻、高頻和空氣感。","Z07 は合計 7 つのドライバーを使用しています。低域用の 10mm チタン振動板ダイナミックドライバー 1 基と、中域、高域、空気感のための 6 基の BA です。","Z07은 총 7개의 드라이버를 사용합니다. 저음을 위한 10mm 티타늄 진동판 다이내믹 드라이버 1개와 중역, 고역, 공기감을 위한 6개의 BA 드라이버입니다."],
  ["Is Z07 suitable for stage monitoring?","Z07 适合舞台监听吗？","Z07 適合舞台監聽嗎？","Z07 はステージモニターに適していますか？","Z07은 스테이지 모니터링에 적합한가요?"],
  ["Yes. Z07 is designed for critical monitoring and long-session professional use. The shark-fin FitMorph option improves stability for stage work, while final suitability still depends on personal fit, isolation needs, and monitoring level.","是的。Z07 专为严苛的监听和长时间专业使用而设计。鲨鱼鳍式 FitMorph 选项可提高舞台使用的稳定性，但最终是否适合仍取决于个人佩戴、隔音需求及监听音量。","是的。Z07 專為嚴苛的監聽和長時間專業使用而設計。鯊魚鰭式 FitMorph 選項可提高舞台使用的穩定性，但最終是否適合仍取決於個人佩戴、隔音需求及監聽音量。","はい。Z07 はクリティカルなモニタリングと長時間のプロフェッショナル使用のために設計されています。シャークフィン FitMorph オプションはステージワークの安定性を向上させますが、最終的な適性は個人のフィット感、遮音性の要求、モニタリングレベルに依存します。","네. Z07은 임계 모니터링 및 장시간 전문가용 사용을 위해 설계되었습니다. 샤크핀 FitMorph 옵션은 스테이지 작업의 안정성을 향상시키지만, 최종 적합성은 개인의 핏, 차음 필요성, 모니터링 레벨에 따라 달라집니다."],
  ["Is Z07 easy to drive?","Z07 容易驱动吗？","Z07 容易驅動嗎？","Z07 は鳴らしやすいですか？","Z07은 구동하기 쉬운가요?"],
  ["Z07 has 12 Ohm impedance and 101dB sensitivity, so it can be driven by portable players and phone dongles. A clean, low-output-impedance source is recommended for best noise control.","Z07 的阻抗为 12Ω，灵敏度为 101dB，因此便携播放器和手机小尾巴即可驱动。建议使用干净、低输出阻抗的音源，以获得最佳底噪控制。","Z07 的阻抗為 12Ω，靈敏度為 101dB，因此便攜播放器和手機小尾巴即可驅動。建議使用乾淨、低輸出阻抗的音源，以獲得最佳底噪控制。","Z07 は 12Ω のインピーダンスと 101dB の感度を備えているため、ポータブルプレーヤーやスマホドングルでも駆動できます。ノイズ制御を最適化するには、クリーンで低出力インピーダンスのソースを推奨します。","Z07은 12옴 임피던스와 101dB 감도를 가져 포터블 플레이어와 스마트폰 동글로 구동할 수 있습니다. 노이즈 제어를 위해 깨끗하고 낮은 출력 임피던스 소스를 권장합니다."],
  ["What is the difference between the two included FitMorph fit options?","附带的两种 FitMorph 佩戴选项有什么区别？","附带的兩種 FitMorph 佩戴選項有什麼區別？","付属の 2 つの FitMorph フィットオプションの違いは何ですか？","포함된 두 가지 FitMorph 핏 옵션의 차이는 무엇인가요?"],
  ["The shark-fin option gives stronger outer-ear lock-in for stability. The finless option gives a cleaner contour with less pressure, which can be better for smaller ears or relaxed listening.","鲨鱼鳍选项提供更强的外耳锁定以获得稳定性。无鳍选项则提供更干净的轮廓和更小的压力，更适合小耳朵或轻松聆听。","鯊魚鰭選項提供更強的外耳鎖定以獲得穩定性。無鰭選項則提供更乾淨的輪廓和更小的壓力，更適合小耳朵或輕鬆聆聽。","シャークフィンオプションは安定性のためにより強力な外耳固定を提供します。フィンレスオプションはより少ない圧力ですっきりした輪郭を提供し、小さな耳やリラックスしたリスニングに適しています。","샤크핀 옵션은 안정성을 위해 더 강력한 외이 고정을 제공합니다. 핀리스 옵션은 더 적은 압력으로 깔끔한 윤곽을 제공하여 작은 귀나 편안한 청취에 더 좋을 수 있습니다."],
  ["Can Z07 be customized like a custom IEM?","Z07 能否像定制 IEM 一样进行定制？","Z07 能否像客製 IEM 一樣進行客製？","Z07 はカスタム IEM のようにカスタマイズできますか？","Z07은 커스텀 IEM처럼 맞춤 제작할 수 있나요?"],
  ["Z07 remains a universal monitor, but an optional custom FitMorph fit option can be made from an outer-ear impression. It customizes how Z07 rests in the outer ear while the canal still seals with silicone ear tips.","Z07 仍然是通用型耳机，但可选的外耳定制 FitMorph 佩戴方案可通过外耳印模制作。它定制了 Z07 在外耳中的贴合方式，而耳道仍由硅胶耳塞套密封。","Z07 仍然是通用型耳機，但可選的外耳客製 FitMorph 佩戴方案可透過外耳印模製作。它客製了 Z07 在外耳中的貼合方式，而耳道仍由矽膠耳塞套密封。","Z07 はあくまでユニバーサルモニターですが、オプションのカスタム FitMorph フィットオプションは外耳 impression から作成できます。これは Z07 が外耳にどのように収まるかをカスタマイズするもので、耳道は引き続きシリコンイヤーピースで密閉されます。","Z07은 여전히 유니버설 모니터이지만, 선택형 맞춤 FitMorph 핏 옵션은 외이 인상 채취를 통해 제작할 수 있습니다. 이는 Z07이 외이에 안착하는 방식을 맞춤화하며, 이도는 여전히 실리콘 이어팁으로 밀착됩니다."],
  ["What cable connector does Z07 use?","Z07 使用什么线材接口？","Z07 使用什麼線材接口？","Z07 はどのケーブルコネクタを使用しますか？","Z07은 어떤 케이블 커넥터를 사용하나요?"],
  ["Z07 uses a 0.78mm 2-pin connection integrated with the FitMorph fit system. It gives listeners a more reassuring long-term cable connection while keeping the Z07 sound intact.","Z07 使用与 FitMorph 佩戴系统集成的 0.78mm 2-pin 接口。它为听众提供了更可靠的长期线材连接，同时保持 Z07 的声音完整性。","Z07 使用與 FitMorph 佩戴系統整合的 0.78mm 2-pin 接口。它為聽眾提供了更可靠的長期線材連接，同時保持 Z07 的聲音完整性。","Z07 は FitMorph フィットシステムと統合された 0.78mm 2ピンコネクタを使用します。これにより、Z07 のサウンドを損なうことなく、長期的により安心感のあるケーブル接続をリスナーに提供します。","Z07은 FitMorph 핏 시스템과 통합된 0.78mm 2핀 커넥터를 사용합니다. 이는 Z07 사운드를 그대로 유지하면서 더 안심할 수 있는 장기적인 케이블 연결을 청취자에게 제공합니다."],
  ["Does Z07 come with a warranty?","Z07 有保修吗？","Z07 有保固嗎？","Z07 には保証が付いていますか？","Z07에는 보증이 제공되나요?"],
  ["Yes. Z07 includes a 1-year warranty covering manufacturing defects under normal use. For support, contact AAW Singapore or the authorized dealer where you purchased it.","是的。Z07 提供 1 年保修，涵盖正常使用下的制造缺陷。如需支持，请联系 AAW Singapore 或购买时的授权经销商。","是的。Z07 提供 1 年保固，涵蓋正常使用下的製造缺陷。如需支援，請聯絡 AAW Singapore 或購買時的授權經銷商。","はい。Z07 には通常使用における製造上の欠陥を対象とする 1 年間の保証が付いています。サポートについては、AAW Singapore または購入先の正規販売店にお問い合わせください。","네. Z07에는 정상 사용 시 제조상 결함을 보장하는 1년 보증이 포함됩니다. 지원이 필요하면 AAW Singapore 또는 구매처 공인 딜러에 문의하세요."],
  ["Where can I demo AAW Z07 in Singapore?","在新加坡哪里可以试听 AAW Z07？","在新加坡哪裡可以試聽 AAW Z07？","シンガポールで AAW Z07 を試聴できる場所は？","싱가포르에서 AAW Z07을 청음할 수 있는 곳은 어디인가요?"],
  ["In Singapore, you can start with AAW Office, Zeppelin & Co., JABEN, or AV One. For demo, support, warranty, or dealer questions, contact AAW Singapore at support@aaw.me or +65-8731-5476.","在新加坡，您可以从 AAW Office、Zeppelin & Co.、JABEN 或 AV One 开始试听。如需试听、支持、保修或经销商咨询，请联系 AAW Singapore：support@aaw.me 或 +65-8731-5476。","在新加坡，您可以從 AAW Office、Zeppelin & Co.、JABEN 或 AV One 開始試聽。如需試聽、支援、保固或經銷商諮詢，請聯絡 AAW Singapore：support@aaw.me 或 +65-8731-5476。","シンガポールでは、AAW Office、Zeppelin & Co.、JABEN、AV One からお試しいただけます。試聴、サポート、保証、販売店に関するお問い合わせは、AAW Singapore（support@aaw.me / +65-8731-5476）までご連絡ください。","싱가포르에서는 AAW Office, Zeppelin & Co., JABEN, AV One에서 청음을 시작할 수 있습니다. 청음, 지원, 보증, 딜러 문의는 AAW Singapore(support@aaw.me / +65-8731-5476)로 연락하세요."],
  ["Can I buy Z07 outside Singapore?","我可以在新加坡以外购买 Z07 吗？","我可以在新加坡以外購買 Z07 嗎？","Z07 はシンガポール以外でも購入できますか？","싱가포르 외 지역에서 Z07을 구매할 수 있나요?"],
  ["Yes. Outside Singapore, AAW works with specialist audio stores and listening rooms across Hong Kong, Macau, Japan, China, South Korea, and Thailand. Use the store locator to find the closest authorized listening point or dealer.","可以。在新加坡以外，AAW 与香港、澳门、日本、中国大陆、韩国和泰国的专业音频店及试听空间合作。使用店铺定位器查找最近的授权试听点或经销商。","可以。在新加坡以外，AAW 與香港、澳門、日本、中國大陸、韓國和泰國的專業音頻店及試聽空間合作。使用商店定位器查找最近的授權試聽點或經銷商。","はい。シンガポール以外では、AAW は香港、マカオ、日本、中国、韓国、タイの専門オーディオストアやリスニングスポットと連携しています。ストアロケーターを使って、最寄りの正規試聴スポットや販売店を見つけてください。","네. 싱가포르 외 지역에서는 AAW가 홍콩, 마카오, 일본, 중국, 한국, 태국의 전문 오디오 매장 및 리스닝 공간과 협력하고 있습니다. 매장 찾기 페이지를 사용하여 가장 가까운 공인 청음 지점 또는 딜러를 찾으세요."],
  ["AAW Z07 Tubeless Hybrid In-Ear Monitor","AAW Z07 无导管混合入耳式监听耳机","AAW Z07 無導管混合入耳式監聽耳機","AAW Z07 チューブレスハイブリッド IEM","AAW Z07 튜브리스 하이브리드 IEM"],
  ["AAW Z07 is a universal-fit hybrid reference in-ear monitor from Singapore-based Advanced AcousticWerkes, led by the FitMorph adaptive fit system. Its interchangeable FitMorph options let listeners choose shark-fin stability, cleaner finless comfort, or optional custom outer-ear support while keeping the same seven-driver Z07 sound. Inside, a 10mm titanium dynamic driver and six balanced armatures are tuned through a true 3-way crossover in a tube-free, filter-free acoustic chamber, giving Z07 confident bass, clear imaging, and stable long-session listening.","AAW Z07 是来自新加坡 Advanced AcousticWerkes 的一款通用型混合参考级入耳式监听耳机，以 FitMorph 自适应佩戴系统为核心。其可互换的 FitMorph 选项让听众可以在保持七单元 Z07 声音不变的前提下，选择鲨鱼鳍式稳固、更干净的无鳍舒适，或可选的外耳定制支撑。内部，一个 10mm 钛金属动圈和六个动铁单元通过真正的三路分频在无导管、无阻尼网的声学腔体中调校，赋予 Z07 自信的低频、清晰的结像和稳定的长时间聆听体验。","AAW Z07 是來自新加坡 Advanced AcousticWerkes 的一款通用型混合參考級入耳式監聽耳機，以 FitMorph 自適應佩戴系統為核心。其可互換的 FitMorph 選項讓聽眾可以在保持七單體 Z07 聲音不變的前提下，選擇鯊魚鰭式穩固、更乾淨的無鰭舒適，或可選的外耳客製支撐。內部，一個 10mm 鈦金屬動圈和六個平衡電樞單體透過真正的三路分頻在無導管、無阻尼網的聲學腔體中調校，賦予 Z07 自信的低頻、清晰的結像和穩定的長時間聆聽體驗。","AAW Z07 は、シンガポールの Advanced AcousticWerkes によるユニバーサルフィット・ハイブリッドリファレンス IEM であり、FitMorph アダプティブフィットシステムを中心に据えています。交換可能な FitMorph オプションにより、リスナーは同じ 7ドライバー Z07 サウンドを維持しながら、シャークフィン安定型、すっきりフィンレス快適型、またはオプションのカスタム外耳サポートを選択できます。内部では、10mm チタンダイナミックドライバーと 6基の BA が、チューブレス・フィルターレスの音響チャンバー内で真の3ウェイクロスオーバーを通じてチューニングされ、Z07 に自信のある低域、明確なイメージング、安定した長時間リスニングを提供します。","AAW Z07은 싱가포르 기반 Advanced AcousticWerkes의 유니버설 핏 하이브리드 레퍼런스 IEM으로, FitMorph 적응형 핏 시스템을 중심으로 합니다. 교체 가능한 FitMorph 옵션을 통해 청취자는 동일한 7드라이버 Z07 사운드를 유지하면서 샤크핀 안정형, 깔끔한 핀리스 편안함, 또는 선택형 맞춤 외이 서포트를 선택할 수 있습니다. 내부적으로는 10mm 티타늄 다이내믹 드라이버와 6개의 BA 드라이버가 튜브리스, 필터 프리 어쿠스틱 챔버 내에서 진정한 3웨이 크로스오버를 통해 튜닝되어, Z07에 자신감 있는 저음, 선명한 이미징, 안정적인 장시간 청취를 제공합니다."],
  ["Founder and tuning engineer of Advanced AcousticWerkes, involved in the acoustic design and tuning of AAW in-ear monitors.","Advanced AcousticWerkes 创始人兼调音工程师，参与 AAW 入耳式耳机的声学设计与调音。","Advanced AcousticWerkes 創辦人兼調音工程師，參與 AAW 入耳式耳機的聲學設計與調音。","Advanced AcousticWerkes の創業者兼チューニングエンジニア。AAW IEM の音響設計とチューニングに携わる。","Advanced AcousticWerkes 창립자 겸 튜닝 엔지니어로, AAW IEM의 음향 설계 및 튜닝에 참여함."],
  ["in-ear monitor tuning","入耳式监听耳机调音","入耳式監聽耳機調音","IEM チューニング","IEM 튜닝"],
  ["hybrid IEM design","混合单元入耳式耳机设计","混合單元入耳式耳機設計","ハイブリッド IEM 設計","하이브리드 IEM 설계"],
  ["balanced armature drivers","动铁单元 / 平衡电枢单元","平衡電樞單體","バランスドアーマチュアドライバー","밸런스드 아마추어 드라이버"],
  ["dynamic driver integration","动圈单元整合","動圈單體整合","ダイナミックドライバーの統合","다이내믹 드라이버 통합"],
  ["custom in-ear monitors","定制入耳式监听耳机","客製入耳式監聽耳機","カスタム IEM","커스텀 IEM"],
  ["universal in-ear monitors","通用型入耳式监听耳机","通用型入耳式監聽耳機","ユニバーサル IEM","유니버설 IEM"],
  ["Universal In-Ear Monitor","通用型入耳式监听耳机","通用型入耳式監聽耳機","ユニバーサル IEM","유니버설 IEM"],
  ["Driver Configuration","单元配置","單體配置","ドライバー構成","드라이버 구성"],
  ["1 dynamic driver + 6 balanced armature drivers","1 动圈单元 + 6 动铁单元","1 動圈單體 + 6 平衡電樞單體","1 ダイナミックドライバー + 6 BA ドライバー","1 다이내믹 드라이버 + 6 BA 드라이버"],
  ["Dynamic Driver","动圈单元","動圈單體","ダイナミックドライバー","다이내믹 드라이버"],
  ["Fit System","佩戴系统","佩戴系統","フィットシステム","핏 시스템"]
];

  const dictionaries = rows.reduce((map, row) => {
    const en = row[0];
    const values = keepEnglish.has(en)
      ? { en, zh: en, zhHant: en, ja: en, ko: en }
      : { en, zh: row[1], zhHant: row[2], ja: row[3], ko: row[4] };
    map.set(normalize(en), values);
    return map;
  }, new Map());

  let collected = false;
  const textNodes = [];
  const attrNodes = [];

  function normalize(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function withOriginalWhitespace(original, replacement) {
    const leading = String(original).match(/^\s*/)[0];
    const trailing = String(original).match(/\s*$/)[0];
    return `${leading}${replacement}${trailing}`;
  }

  function shouldSkip(node) {
    const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
    if (!element) return true;
    return Boolean(element.closest("script, style, noscript, textarea, select, option, .z07-lang-switch, .jdgm-widget, .jdgm-rev-widg"));
  }

  function collect() {
    if (collected) return;
    const roots = document.querySelectorAll(".z07-feature-shell");
    const scanRoots = roots.length ? roots : [document.body];

    scanRoots.forEach((root) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (shouldSkip(node) || !normalize(node.nodeValue)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });

      while (walker.nextNode()) {
        textNodes.push({ node: walker.currentNode, original: walker.currentNode.nodeValue });
      }

      root.querySelectorAll("*").forEach((element) => {
        if (shouldSkip(element)) return;
        ["alt", "title", "aria-label"].forEach((attr) => {
          if (element.hasAttribute(attr) && normalize(element.getAttribute(attr))) {
            attrNodes.push({ element, attr, original: element.getAttribute(attr) });
          }
        });
      });
    });

    collected = true;
  }

  function translate(lang) {
    const activeLang = languages[lang] ? lang : "en";
    collect();
    document.documentElement.dataset.z07Lang = activeLang;
    document.documentElement.lang = languages[activeLang].htmlLang;

    document.querySelectorAll(".z07-lang-switch button[data-z07-lang]").forEach((button) => {
      const isActive = button.dataset.z07Lang === activeLang;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    textNodes.forEach(({ node, original }) => {
      const hit = dictionaries.get(normalize(original));
      node.nodeValue = hit ? withOriginalWhitespace(original, hit[activeLang] || hit.en) : original;
    });

    attrNodes.forEach(({ element, attr, original }) => {
      const hit = dictionaries.get(normalize(original));
      element.setAttribute(attr, hit ? hit[activeLang] || hit.en : original);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    collect();
    document.querySelectorAll(".z07-lang-switch button[data-z07-lang]").forEach((button) => {
      button.addEventListener("click", () => translate(button.dataset.z07Lang));
    });
    translate("en");
  });
})();
