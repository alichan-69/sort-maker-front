# 開発メモ
# URL
https://sort-maker-front-heroku.herokuapp.com
# イメージ
暖色系  
ソートメーカーを使えば楽しいことができるようなポップなイメージ  

# 必要機能
・外部ファイルのインポート  
└componentsに書く  
・$_POSTによるフォームからの値受け取り  
└v-bind、v-modelの使用  
・データベース接続  
└expressの使用  
└frontとbackのファイルをわけてそれぞれのサーバーを立ち上げ、frontからapiたたいてbackでデータベース接続する  
・セッション保持  
└vuex-persistedstateの利用  
・ヘッド、ヘッダー、フッターの外部化  
└コンポーネント化  
・APIの利用  
└axiosの利用  
・urlパラメーターの取得  
└vue-routerの使用  
・自発的に別ページへ飛ぶ  
└vue-routerの使用  
・urlの設定  
└vue-routerの使用  

# 使用ライブラリ  
・フロント  
Vue.js  
Vuex  
VueRouter  
Vuetify  
Vuex-persisted-state  
axios  
VueCroppa  
└画像トリミング実装のため  
firebase  
└最初バックエンドでfirebaseに関する処理を行おうと思ったが、ツイッターログインする際のredirect処理時にエラーが発生したため断念  
・バックエンド  
express  
・コード整形用ライブラリ  
eslint  
prettier  
vetur  

# フォルダ構成
・sort-maker-front  
public  
└静的ファイル  
src  
└common_functions  
	└user_request.js(api叩く関数)  
	└validate.js(バリデーションチェックを行う関数)  
└router  
	└VueRouterインスタンスを作成  
└components  
	└よく利用するコンポーネント  
└store  
	└Vuexに関するコード  
└templates  
	└画面  
└vuetify  
	└vuetifyに関するコード  
・sort-maker-back  
app.js(サーバーを立てる処理、ルーティング処理)  
route  
└ルーティングされた後のAPIの処理  
common_functions  
└共通する処理(認証等)  
  
# データベース設計  
・users  
└user_id  
	└プライマリーキー兼firebase上で保存されている一意のid  
└name  
	└ユーザーの名前  
└delete_flg  
	└ユーザーが消されているかどうかのフラグ  
└login_time  
	└最後にログインした日付と時刻  
└create_date  
	└作成された日付と時刻  
・sorts  
└id  
	└プライマリーキー  
└name  
	└ソートの名前  
└description  
	└ソートの説明  
└image  
	└ソートの画像  
└user_id  
	作成者のユーザーid  
└play_count  
	└ソートが遊ばれた回数  
└delete_flg  
	└ソートが消されているかどうかのフラグ  
└create_date  
	└作成された日付と時刻  
└update_date  
	└更新された日付と時刻  
・sort_items  
└id  
	└プライマリーキー  
└name  
	└ソートアイテムの名前  
└image  
	└ソートアイテムの画像  
└sort_id  
	└所属するソートのid  
└delete_flg  
	└ソートアイテムが消されているかどうかのフラグ  
└create_date  
	└作成された日付と時刻  
└update_date  
	└更新された日付と時刻  
・likes  
└id  
	└プライマリーキー  
└sort_id  
	└お気に入り登録したソートのid  
└user_id  
	└お気に入り登録したユーザーのid  
└delete_flg 
	└ソートアイテムが消されているかどうかのフラグ  
└create_date  
	└作成された日付と時刻  
└update_date  
	└更新された日付と時刻  
  
# firebaseのディレクトリ構造
images  
  └sort_titles  
  	└{sort_id}  
  └sort_items  
	└{sort_id}_{sort_item_id}  
  	
# 公開する前にやること
・heroku公開用のgithubのリポジトリはprivateにする  
・accesstoken,secret保存時の暗号化用のkeyは変える  
・環境変数内のurlを設定する  
・ツイッターに投稿するurlを変える  
  
# 画像サイズ
大　1920  
中　1000  
小　600  
  
# 作成の流れ
1.まずユーザーの使用する画面を一つ簡単につくる  
2.その後不随する機能をつける  
3.リファクタリング、関数による処理の省略をする  
4.その後画面デザイン  
  
# やり残し
twitterをredirectで認証  
