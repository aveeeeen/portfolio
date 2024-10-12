---

title: "コードの流用と共有のネットノグラフィー：観察編"
tags: "article,ライブコーディング,研究"
update: 20241009

---

# Tidal Cyclesサーバー内での観察による調査

Tidal CyclesのDiscordサーバー内では、コードの共有を通してライブコーダーが具体的に何を行っているのかを明らかにするために、サーバー内の会話やコードのやり取りに着目する。Discordはサーバーという単位でオンライン上のバーチャルなコミュニティーが形成可能で、サーバー内ではチャンネルというそれぞれ独立した話題について会話をするための場によってコミュニティーが構造化されており、複数のチャンネルによって構成されている。私が調査したTidal CyclesのDiscordサーバーも二十個ほどのチャンネルによって構成されており、それぞれのチャンネルは大まかにそこで話されるテーマごとにグループ化されていた。それらのチャンネルのうち、本研究では、活発に会話とコードのやり取りが行われている#code-talkと#pattern-snippetsの二つのチャンネルを観察した。

ここで主に行っている調査手法は観察である。観察という調査手法はネットノグラフィーでよく取られている調査の方法であり、Kozinets（2015）が分類する3つのデータ収集の活動のうちの調査的なデータ収集の活動に分類される。調査的なデータ収集は、リサーチする内容に基づいてソーシャルメディアや掲示板サイトの投稿を検索やウェブスクレイピングを使ってデータを収集する方法が主に用いられる。そして、特定のキーワードや投稿内容をもとにリサーチクエスチョンを解明するに当たる投稿を選択して分析できるようにデータ化する。ここでも、discordというソーシャルメディアの中でコードが共有されている投稿というマーカーに基づいてそれに該当する投稿をメモアプリに貼り付けることで、データを作成し、分析を行った。

ライブコーダーがコードをどのように共有しているかを知るために私は上記の二つのチャンネルの2023年から現在に至るまでの投稿に限定した。この期間内に限定した理由はそれ以前のすべての投稿を集める場合、投稿の量的にデータを集める上での限界があるように感じたためだ。ここでの目的はライブコーダーがコードの共有の営為であるため、上記の観察手法のように、特定のキーワードに絞って観察を行うことはできず、コードが共有されている投稿すべてを精査する必要がある。また、投稿は一つで簡潔するものだけでなく、一連の会話という形でライブコーダーがコードを共有しているケースが多く見られた。これらの理由で、量よりも質を優先し、ライブコーダーの習慣が確認できるほど十分な期間のデータを集め分析を行うことが賢明だと感じた故にこうなった。

## 問題解決のためのコードの共有

コードを共有するやり取りの中で最も多く見られたのが、コードを通したQ&Aである。これらのやり取りは#code-talkのチャンネルで特に多く見られた。そのやりとりの多くはある質問者が特定の実現したいことに対して問題が解決するまで会話が行われるといったものだ。その中で、コードは実現したいことや問題となっていることを表現する上で用いられている。これらを問題解決のためのコードの共有とラベル付けした上で、その一例を実際の会話のやり取りと共により詳細にどのようなコードの共有の営みがあるかを説明する。

以下が#code-talkで見られた問題解決のための情報共有としてコードが共有されている一連の会話である。個人情報を保護するために、ユーザー名は省略した名前を用いる。この会話で質問者はOSである。そして、あるユーザーに対する返信は「[ ]」で囲むことで明示する。


> **OSFebruary 13, 2023 6:36 AM**

>next challenge, I'm working on an an approach where I will take a list of lists of pitches (such as `[[-3,1,4],[-6,-3,2],[-6,-3,2],[-5,-1,2]]`) and I will use them with `toScale` like behaviour but dividing the different lists over a duration of a pattern -- does anyone have any thoughts on a 'best' way to approach this

>**OSFebruary 13, 2023 6:36 AM**

>so for example, that list of lists above applied to something like `"[0 1 2 3]*4"` should arpeggiate each list up to the octave, over the time division is falls into 

>**OSFebruary 13, 2023 6:46 AM**

>what approaches would you take for applying different functions divided over the duration of a pattern


ここでOSはピッチが納入されているリストを用意してtoScaleのような挙動だが、代わりに異なるリストが入れ子になっているリストを操作してパターンとして呼び出す上で、最も良い実装方法はないかと聞いている。ここでのtoScaleという関数はあるリスト（[2,4,6,8,10]のような配列）に格納されている数字の羅列をもとに音階や和音を生成するものだ。そして、その音階をもとに特定の指数でその音階の音を呼び出すことができる。おそらく、ここでOSが実現しようとしていることは、任意の音階を用意して、それらを特定のパターン（特定の値を特定の拍へとマッピングするTidal Cyclesの用語）でそれらの音階ごとに音を鳴らすということだろう。

>**@OS**

>[what approaches would you take for applying different functions divided over the duration of a pattern]

>**CLFebruary 13, 2023 6:49 AM**

>I think one of the `cat` related functions will serve you here

>**CLFebruary 13, 2023 6:50 AM**

>You've also got `weave`

これに対してCLはcatとweaveという関数がそれを実現するのではないかと提案する。ここでのcatという関数は一連の関数を配列に格納することでパターン化するものである。そしてweaveも似たような挙動を示す。

>**OSFebruary 13, 2023 6:57 AM**

>oh yeah I'm familiar with `cat`s, I was initially looking at `within` to manually apply to different parts of the pattern

>**OSFebruary 13, 2023 6:57 AM**

>`weaveWith` looks potentially like a fit

>**OSFebruary 13, 2023 6:58 AM**

>need to plat with it a bit to get a feel for the behaviour

>**OSFebruary 13, 2023 7:25 AM**

>exploring simplest possible versions, doing something like this manually does something like what I'm looking for -- need to figure out a way to space it out over the cycling of the pattern in an algorithmic way

>```hs
>l = [[-3,1,4],[-6,-3,2],[-6,-3,2],[-5,-1,2]]
>d1 $ note (toScale (l!!0) "0 1 2 3") #ch 12 
>```

CLの提案に対してcatとweaveの関数がどのような動作をするかは知っていると答えている。加えて、初めはwithinという関数を使って手動で別々のリストをパターン化することで目的を達成しようとしていたという。その後、目的としている音階のリスト化を手動で実現した例を送っている。これのリストの項目を自動的に走査するアルゴリズムを考えようとしていることをコードの例を通して示しているというわけだ。

>**OS*February 13, 2023 7:58 AM***

>in pseudocode basically trying to figure out how to do something like this:

>```hs
>l = toScale <$> [[-3,1,4],[-6,-3,2],[-6,-3,2],[-5,-1,2]]
>d1 $ note (l +| "0 1 2 3") #ch 12
>```

>**OSFebruary 13, 2023 8:02 AM**

>anyway I'm just thinking through my approach out loud really, I will work in it for a bit

>**OS*February 13, 2023 8:59 AM***

>I'm sure I'll find tons of nuances and be able to tidy the logic up a lot but this seems to work as an initial attempt 

>```hs
>d1 $ (cat $ note <$> (`toScale` "0 1 2 3") <$> [[-3,1,4],[-6,-3,2],[-6,-3,2],[-5,-1,2]]) #ch 12
>```

>**OS*February 13, 2023 5:54 PM***

>I wonder if I could do it the other way around, where instead of applying the repeating pattern over the list of `toScale` variations, it takes the list of `toScale` variations and applies them equally divided over the duration of a patterns repetition 

その後、OSは実際には動かないが擬似的なコードで自分が実現したい動作を共有している。これが上のブロックの一番最初の投稿である。このようにコードそのものがコミュニケーションの手段として相手へ伝えたいことを包含していることがある。つまり、コードが伝えたい内容や表現したい内容を媒介している。このようにコードはパフォーマンス上で記述される特別な言語ではなく、かれらにとっては音楽を表現する上で日常的に用いる言語なのである。言葉で伝える以上にコードで音楽的な内容を表現した方が効率が良いのだ。

上のブロックの3つ目の投稿でOSは自分の目的が実現できたコードを共有する。しかし、「be able to tidy up the logic up a lot」と言い表していることからわかるように、このコードではアルゴリズムの簡潔さや読みやすさから満足できていないことが推測できる。そこで別の手法として、リストをtoScaleのバリエーションに走査させる代わりに、toScaleのリストをパターン化する方法はないかと模索している。

>**RTFebruary 16, 2023 2:06 PM**

>**@OS** nice!   this is the closest i've seen to "patterning the scale"

>**RTFebruary 16, 2023 2:08 PM**

>i usually just use the `toScale` function multiple times inside `cat` .   repetitive though if you're trying to preserve the  "0 1 2 3" sequence across all the chords.

>**RTFebruary 16, 2023 2:13 PM**

>you could use a do block.

>```hs
>do
>  let p = "0 1 2 3"
>  d1 $ n (cat [ toScale [-3,1,4] p, toScale [-6,-3,2] p, toScale [-6,-3, 2] p, toScale [-5,-1,2] p])  # ch 12
>``` 

先ほどのOSが示した音階をパターン化することに成功したコードに対して、RTが「今まで見た中でスケールをパターン化する方法として一番近いやりかただ」と賞賛する。その上で自分ならこのように実現するという例を紹介している。それはtoScaleの関数をcatの配列の中に内包することでパターン化するという方法だ。

このようにライブコーディングでは、一つの結果に対してあらゆるアルゴリズムの可能性がある。一つの音の操作や音の出力に対して、ライブコーダーそれぞれやり方が異なるということがライブコーダーの実践や文化を理解する上で重要な特性である。

>**RTFebruary 16, 2023 3:15 PM**

>ahhh this is getting fun.  functionalizing it into  `void`, and using scale patterns instead of scale lists

>```hs
>--helper functions for using patterns instead of lists as scales
>let patternToList pat = map value $ sortOn whole $ queryArc pat (Arc 0 1)
>    tScale scalePat pat = toScale (patternToList scalePat) pat
>-- the actual function
>let void p scalePatList = cat $ note <$> (`tScale` p) <$> scalePatList
>```

>**RTFebruary 16, 2023 3:17 PM**

>then it's just 

>```hs
>d1 $ void "0 1 2 3" ["-3 1 4", "-6 -3 2", "-6 -3 2", "-5 -1 2"] # ch 12 
>```

>**RTFebruary 16, 2023 3:24 PM**

>here's a demo, getting into chris clark IDM territory

>```hs
>d1 $ sliceDiv 14 15 16 "<2 3>"
>$  void ("[0 1 2 3 4 5 1 2 3 4 0 1 2 3 4 0 1 0 2 0 3 0 4]/4" +| "[0 5 8 11]*4") ["0 2 7 9 11", "0 4 9 11 14", "0 2 4 9 11"] 
># m "[1, 2, 3, 4]" 
>```

>**「音源ファイル」void_demo.mp3**　**625.51 KB　0:09/0:16**

その後RTはこの内容に打ち込むことが楽しくなったと投稿し、OSの実現したスケールのパターン化で色々と実験を始める。まず、スケールをパターン化する上で使いやすいように自らそれを手助けする関数を記述し、共有している。そしてその例を共有している。最後にこれをもとに作成したコードの断片とそれによって作られた音楽を共有する。この音楽は全長16秒と短いデモンストレーションであるが、旋律が複雑に入り乱れるユニークなものだった。

>**OSFebruary 16, 2023 6:09 PM**

>Niiccee!! looking forward to experimenting with these in a bit

>**OSFebruary 16, 2023 6:09 PM**

>I'll see if I can share a bit of music, have some super cool functions generating harmonic progressions to feed into it

RTの投稿に対してOSは素晴らしいと賞賛を述べ、これを使って実験してみると言い残しこの一連の会話は幕を閉じる。

上で紹介しているのは、問題解決のためのコードの共有の一連の営みの一例であり、このような問題解決のためにコードの共有し合う様子はこのdiscord内のコードの共有の大部分を占める。次に、問題解決のためのコードの共有がライブコーダー全体にとってどのような意味を持つかを考えてみたい。

問題解決のためのコードの共有は俯瞰した視点でみるとコードの共有を通してライブコーディングが持つ表現しうる内容が解明されていっているといってもいいだろう。つまり、discord上で問題解決のためにコードを共有し合うことを通じてTidal Cyclesというプログラム可能であるが故に限りなく可能性のある表現をコミュニティー全体で明らかにしているのである。問題解決のためのコードの共有では、ただ淡々とある投稿者の解決したい問題が投稿されているのではなく、一つの問題に対して、様々な解決方法がコードの共有を通して開示される。また、その問題から派生して似た表現の応用が生み出されたりと、ライブコーディングに対する新たな知見が生み出されているのである。したがって、コードの共有を通して、このチャンネルそのものが集合知としての機能を果たして、Tidal Cyclesというライブコーディングをする上での環境での表現技法の壮大な知識ベースを形成し、それが絶えずアップデートされているのだ。まるで、巨大な百科事典を有志で編むwikipediaやヒッピーコミュニティーによって世界のハッキーで奇異な知見が綴じられたWorld Earth Catalogのように。

## スニペットの共有

問題解決のためのコードの共有ではない形で見られた共有の形が、スニペットの共有である。これは、#pattern-snippetsのチャンネルで多く観察された。スニペットとは切り取られた断片という意味であり、ここではTidal Cyclesで演奏できる音楽が書かれたコードを部分的に切り取ったものを指すことにする。#pattern-snippetsのチャンネルでは上で説明されたようなスニペットが不定期に投稿されていた。以下でも、実際に投稿されていた事例を示しながらスニペットの共有について説明を行う。

>**GKSeptember 28, 2023 6:32 PM**

>```hs
>xen n p = toScale (map (\x -> x / n * 12) [0..(n-1)]) p
>
>d1  $ (# rate (rand*2)) 
>    $ rolledBy (rand*0.2)
>    $ superimpose ((degrade) . (arp "pinkyupdown") . (|+ note 36) . (# release 0.4))
>    $ jux (|- note 0.018)
>    $ note (xen 5 "<[-3,0,2,4] [-4,1,3,4] [-5,-2,3,5] [-5,-2,3,6]>/2")
>    |+ note "[0,0.02,-0.01]" |- note 12
>    # "supersaw" # legato 1.05 |* gain 0.5
>    # voice 0 # lfo 1 # lpf 9000 
>    # room 0.9 # size 0.9
>```

スニペットの共有を通してライブコーダーは自分の見つけた面白い表現や、今その人自身が試している表現を共有することを通じて交流をとっている。ライブコーディングでは自分の環境で利用するコードは複雑な処理を短くするために、処理の一部を独自の関数に内包したりするが、ここでのスニペットはそうした自分の環境でしか動かないようなコードは共有されていなかった。つまり、#pattern-snippetsに投稿されているスニペットはTidal Cyclesのデフォルトの環境で動作するように配慮されている。このことから、明らかにライブコーダーがスニペットを共有する際は自分以外の人が使えるように意識しているといえる。そして、これらのスニペットの多くには、リアクションが付いていた（discordのようなコミュニティーチャットシステムでよく見られる、投稿に絵文字を通して、それを見た人の反応を量的に示すことができる機能）。