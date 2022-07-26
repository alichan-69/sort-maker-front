<template>
    <div>
        <Layout subTitle="ソートを編集する">
            <VForm ref="form" class="v-form" v-model="valid">
                <h2>ソートのタイトル</h2>
                <SortCardInput
                    className="mx-auto"
                    :blob="blob"
                    :description="description"
                    :name="name"
                    :width="300"
                    :initialImage="initialImage"
                    @inputDescription="inputDescription"
                    @inputName="inputName"
                    @sendBlob="sendBlob"
                />
                <h2>ソートアイテム</h2>
                <VForm ref="itemForm" v-model="itemValid">
                    <SortItemInput
                        :blob="itemBlob"
                        className="mx-auto"
                        v-model="itemName"
                        :width="300"
                        @sendBlob="sendItemBlob"
                    />
                </VForm>
                <CustomButton :block="true" text="追加" @click="addSortItem" />
                <template v-if="$mq === 'lg'">
                    <!-- 行を一行に3列アイテムが置かれるときの行数だけ作成する -->
                    <VRow
                        v-for="row in Math.floor(itemNames.length / 3) + 1"
                        :key="'row' + row"
                    >
                        <!-- 列を一行に3列作り、行と列の値からitems配列中から表示する要素のindexを計算する -->
                        <VCol cols="4" v-for="col in 3" :key="'col' + col">
                            <SortItemInput
                                :blob="itemBlobs[(row - 1) * 3 + (col - 1)]"
                                :icon="true"
                                :initialImage="
                                    createInitialImage(
                                        (row - 1) * 3 + (col - 1)
                                    )
                                "
                                v-if="
                                    itemNames[(row - 1) * 3 + (col - 1)] ||
                                    itemNames[(row - 1) * 3 + (col - 1)] === ''
                                "
                                v-model="itemNames[(row - 1) * 3 + (col - 1)]"
                                @clickIcon="
                                    removeSortItem((row - 1) * 3 + (col - 1))
                                "
                                @sendBlob="
                                    sendEditedItemBlob(
                                        (row - 1) * 3 + (col - 1),
                                        $event
                                    )
                                "
                            />
                        </VCol>
                    </VRow>
                </template>
                <template v-if="$mq === 'md'">
                    <!-- 行を一行に1列アイテムが置かれるときの行数だけ作成する -->
                    <VRow v-for="row in itemNames.length" :key="'row' + row">
                        <!-- 列を一行に1列作り、行と列の値からitems配列中から表示する要素のindexを計算する -->
                        <VCol cols="12">
                            <SortItemInput
                                :blob="itemBlobs[row]"
                                :icon="true"
                                :initialImage="createInitialImage(row)"
                                v-if="itemNames[row] || itemNames[row] === ''"
                                v-model="itemNames[row]"
                                @clickIcon="removeSortItem(row)"
                                @sendBlob="sendEditedItemBlob(row, $event)"
                            />
                        </VCol>
                    </VRow>
                </template>
                <VRow>
                    <VCol cols="6">
                        <CustomButton
                            :block="true"
                            text="ソート更新"
                            @click="editSort"
                        />
                    </VCol>
                    <VCol cols="6">
                        <ButtonDialog
                            :block="true"
                            color="warning"
                            classObject="white--text"
                            text="削除する"
                            textColor="white"
                            :dialog="dialog"
                            @inputDialog="inputDialog"
                        >
                            <template v-slot:content>
                                <VCard>
                                    <VCardTitle class="pt-5"
                                        >本当に削除しますか？</VCardTitle
                                    >
                                    <VCardActions>
                                        <CustomButton
                                            :block="true"
                                            color="warning"
                                            classObject="white--text"
                                            text="削除する"
                                            @click="deleteSort"
                                        />
                                    </VCardActions>
                                </VCard>
                            </template>
                        </ButtonDialog>
                    </VCol>
                </VRow>
            </VForm>
        </Layout>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
    CustomButton,
    Layout,
    SortCardInput,
    SortItemInput,
    ButtonDialog,
} from '../components'
import {
    initializeApp,
    showAlert,
    getDownloadURL,
    transitionPage,
} from '@/common_functions/common'
import {
    searchSort,
    searchMultipleSortItems,
    editSort,
    registerSortImage,
    deleteSort,
} from '@/common_functions/request'
import { noImage } from '../assets/no_image.png'

export default {
    components: {
        CustomButton,
        Layout,
        SortCardInput,
        SortItemInput,
        ButtonDialog,
    },
    computed: {
        ...mapGetters(['uid']),
    },
    data() {
        return {
            dialog: false,
            sortId: this.$route.params.sortId,
            blob: require('../assets/no_image.png'),
            description: '',
            name: '',
            itemName: '',
            itemBlob: require('../assets/no_image.png'),
            itemNames: [],
            itemBlobs: [],
            initialImages: [],
            itemValid: true,
            initialImage: '',
            valid: true,
        }
    },
    methods: {
        addSortItem() {
            // バリデーション
            this.$refs.itemForm.validate()
            if (!this.itemValid) return

            // ソートアイテムの数が範囲外の時エラーメッセージをだす
            if (this.itemNames.length + 1 > 100) {
                showAlert('2個以上100個以下で設定してください')
                return
            }

            // ソートアイテムの名前と画像を追加
            this.itemNames.push(this.itemName)
            this.itemBlobs.push(this.itemBlob)
        },
        createInitialImage(index) {
            const url = this.initialImages[index]
            if (!(url === '') && !(url === require('../assets/no_image.png'))) {
                return url
            } else {
                return require('../assets/no_image.png')
            }
        },
        inputDialog(dialog) {
            this.dialog = dialog
        },
        inputDescription(value) {
            this.description = value
        },
        inputName(value) {
            this.name = value
        },
        sendItemBlob(blob) {
            // もしアップロードされた画像が空だったらno_imageを設定する
            if (!blob) {
                this.itemBlob = require('../assets/no_image.png')
                return
            }

            this.itemBlob = blob
        },
        sendEditedItemBlob(index, blob) {
            // もしアップロードされた画像が空だったらno_imageを設定する
            if (!blob) {
                this.itemBlobs[index] = require('../assets/no_image.png')

                // computedで値を見張っているためspliceで値を更新したかったができなかったのでpushとpopで更新
                this.itemBlobs.push('')
                this.itemBlobs.pop()
                return
            }

            this.itemBlobs[index] = blob

            // computedで値を見張っているためspliceで値を更新したかったができなかったのでpushとpopで更新
            this.itemBlobs.push('')
            this.itemBlobs.pop()
        },
        sendBlob(blob) {
            // もしアップロードされた画像が空だったらno_imageを設定する
            if (!blob) {
                this.blob = require('../assets/no_image.png')
                return
            }

            this.blob = blob
        },
        editSort: async function () {
            // ローディングする
            this.updateIsProgress(true)

            // バリデーション
            this.$refs.form.validate()
            if (!this.valid) {
                this.updateIsProgress(false)
                return
            }

            // ソートアイテムの数が範囲外の時エラーメッセージをだす
            if (this.itemNames.length < 2 || this.itemNames.length > 100) {
                showAlert('2個以上100個以下で設定してください')
                this.updateIsProgress(false)
                return
            }

            // ソートとソートアイテムをデータベースに登録
            let postData = {
                user_id: this.uid,
                sort_id: this.sortId,
                name: this.name,
                description: this.description,
                item_names: this.itemNames,
            }

            let res = await editSort(postData)

            if (!res) {
                showAlert('ソートの編集に失敗しました')
                this.updateIsProgress(false)
                return
            }

            // firebaseCloudStorageに画像を登録(アップロードされた画像がno_image.pngで無かった時)
            // 保存する画像の名前に使用するidをとってくる
            const sortId = res.sort_id
            const sortItemIds = res.sort_item_ids

            // ソートのタイトル画像の登録
            const firebase = initializeApp()
            const storageRef = firebase.storage().ref()
            let metadata
            if (this.blob !== require('../assets/no_image.png')) {
                metadata = {
                    contentType: this.blob.type,
                }
            }

            // ファイルの末尾に記載する拡張子を設定
            let extension
            if (this.blob !== require('../assets/no_image.png')) {
                switch (this.blob.type) {
                    case 'image/jpeg':
                        extension = 'jpg'
                        break
                    case 'image/png':
                        extension = 'png'
                        break
                    default:
                        showAlert('画像の登録に失敗しました')
                        this.updateIsProgress(false)
                        return
                }
            }

            // firebaseCloudStorageに画像を登録
            let image = ''
            if (this.blob !== require('../assets/no_image.png')) {
                image = `${sortId}.${extension}`

                await storageRef
                    .child(`/images/sort_titles/${image}`)
                    .put(this.blob, metadata)
                    .catch(() => {
                        showAlert('画像の登録に失敗しました')
                        this.updateIsProgress(false)
                        return
                    })
            }

            // ソートアイテムの画像の登録
            let itemImages = []
            for (let i in sortItemIds) {
                if (this.itemBlobs[i] !== require('../assets/no_image.png')) {
                    metadata = {
                        contentType: this.itemBlobs[i].type,
                    }

                    extension
                    switch (this.itemBlobs[i].type) {
                        case 'image/jpeg':
                            extension = 'jpg'
                            break
                        case 'image/png':
                            extension = 'png'
                            break
                        default:
                            showAlert('画像の登録に失敗しました')
                            this.updateIsProgress(false)
                            return
                    }

                    // firebaseCloudStorageに画像を登録して画像の名前を取得(アップロードされた画像がno_image.pngで無かった時)
                    itemImages[i] = `${sortId}_${sortItemIds[i]}.${extension}`
                    await storageRef
                        .child(`/images/sort_items/${itemImages[i]}`)
                        .put(this.itemBlobs[i], metadata)
                        .catch(() => {
                            showAlert('画像の登録に失敗しました')
                            this.updateIsProgress(false)
                            return
                        })
                } else {
                    itemImages[i] = ''
                }
            }

            // 画像のURLをデータベースに登録
            postData = {
                user_id: this.uid,
                image: image,
                item_images: itemImages,
                sort_id: sortId,
                sort_item_ids: sortItemIds,
            }

            res = await registerSortImage(postData)

            if (!res) {
                showAlert('ソートの編集に失敗しました')
                this.updateIsProgress(false)
                return
            }

            showAlert('ソートを編集しました', 'success')
            this.updateIsProgress(false)
        },
        removeSortItem(index) {
            // ソートアイテムの数が範囲外の時エラーメッセージをだす
            if (this.itemNames.length - 1 < 2) {
                showAlert('2個以上100個以下で設定してください')
                return
            }

            this.itemNames.splice(index, 1)
            this.itemBlobs.splice(index, 1)
        },
        deleteSort: async function () {
            this.updateIsProgress(true)

            const postData = {
                user_id: this.uid,
                sort_id: this.sortId,
            }

            const res = await deleteSort(postData)

            if (!res) {
                showAlert('ソートの削除に失敗しました')
                this.updateIsProgress(false)
                this.inputDialog(false)
                return
            }

            showAlert('ソートを削除しました', 'success')
            this.updateIsProgress(false)
            this.inputDialog(false)
            transitionPage(this, 'mypage')
        },
        ...mapActions(['updateIsProgress']),
    },
    async mounted() {
        // ソートidを渡してソートのデータを取ってくる
        let postData = {
            id: this.sortId,
        }

        let res = await searchSort(postData)

        // ユーザー認証が通らない、または失敗したらアラートを出す
        if (!res || this.uid !== res['user_id']) {
            showAlert('ソートの表示に失敗しました')
            return
        }

        // 成功したらソートの情報を格納
        if (res['image'] !== '') {
            const url = await getDownloadURL(
                `/images/sort_titles/${res['image']}`
            )

            this.initialImage = url

            // blobオブジェクトの作成、格納
            const xhr = new XMLHttpRequest()
            xhr.open('GET', url, true)
            xhr.responseType = 'blob'
            xhr.onload = () => {
                const blob = xhr.response
                this.blob = blob
            }
            xhr.send()
        } else {
            this.initialImage = noImage
        }

        this.name = res['name']
        this.description = res['description']

        // ソートidを渡してソートのアイテムを取ってくる
        postData = {
            id: this.sortId,
        }

        res = await searchMultipleSortItems(postData)

        // ソートのアイテムから値をとってきてitemNamesとitemBlobsに格納する
        for (let i = 0; res['sort_items'].length > i; i++) {
            if (res['sort_items'][i]['image'] !== '') {
                const url = await getDownloadURL(
                    `/images/sort_items/${res['sort_items'][i]['image']}`
                )

                // 初期画像のurlの格納
                this.initialImages.push(url)

                // blobオブジェクトの作成、格納
                const xhr = new XMLHttpRequest()
                xhr.open('GET', url, true)
                xhr.responseType = 'blob'
                xhr.onload = () => {
                    const blob = xhr.response
                    this.itemBlobs.push(blob)
                }
                xhr.send()
            } else {
                this.initialImages.push(noImage)
                this.itemBlobs.push(require('../assets/no_image.png'))
            }

            // 名前の格納
            this.itemNames.push(res['sort_items'][i]['name'])
        }
    },
    name: 'EditSort',
}
</script>

<style lang="scss" scoped>
.v-form {
    & > * {
        margin-bottom: 20px;
    }
}
</style>
