/**
 * newsaan-clipsite: 本物のTwitchクリップデータ
 */

const CLIPS_DATA = [
    {
        "id":  "661675665",
        "title":  "ビッツランキング下位はコメント禁止",
        "game_name":  "Escape from Tarkov",
        "view_count":  754,
        "created_at":  "2021-12-08T16:56:35Z",
        "duration":  "0:11",
        "thumbnail_url":  "https://static-cdn.jtvnw.net/twitch-video-assets/twitch-vap-video-assets-prod-us-west-2/152cbab2-8927-4c6c-a3fb-1b65720acd2a/landscape/thumb/thumb-0000000000-1664x936.jpg",
        "clip_slug":  "DullPlainLouseRickroll-EnYAuxdgsK21Rndy"
    },
    {
        "id":  "3707937370",
        "title":  "俺のウィングマン（割と大きい）",
        "game_name":  "Apex Legends",
        "view_count":  686,
        "created_at":  "2023-11-06T13:46:57Z",
        "duration":  "0:07",
        "thumbnail_url":  "https://static-cdn.jtvnw.net/twitch-video-assets/twitch-vap-video-assets-prod-us-west-2/298350aa-d6e8-4338-ba26-b1c45c4151f7/landscape/thumb/thumb-0000000000-1664x936.jpg",
        "clip_slug":  "PoliteCrazyQueleaStinkyCheese-uO7G3boaqbnXMAvt"
    },
    {
        "id":  "3817295548",
        "title":  "重いなァ～これスタミナとか上がるかな～？死",
        "game_name":  "Escape from Tarkov",
        "view_count":  569,
        "created_at":  "2024-07-03T15:33:08Z",
        "duration":  "0:34",
        "thumbnail_url":  "https://static-cdn.jtvnw.net/twitch-video-assets/twitch-vap-video-assets-prod-us-west-2/dbc37b6e-7da4-4833-a314-525986acee91/landscape/thumb/thumb-0000000000-1664x936.jpg",
        "clip_slug":  "LazyThirstyAlmondBibleThump-cdNCDD4faKqcS4Pi"
    },
    {
        "id":  "1021640051",
        "title":  "とうとうやっちまった",
        "game_name":  "Rust",
        "view_count":  320,
        "created_at":  "2023-10-09T13:48:07Z",
        "duration":  "0:24",
        "thumbnail_url":  "https://static-cdn.jtvnw.net/twitch-video-assets/twitch-vap-video-assets-prod-us-west-2/8f20c61c-b1fb-4b85-972d-7022af471f92/landscape/thumb/thumb-0000000000-1664x936.jpg",
        "clip_slug":  "ZealousFurtiveCaterpillarKAPOW-acOpPyVrChsagDYm"
    },
    {
        "id":  "139870199",
        "title":  "ついにAPEXからもイジられるにゅーさん",
        "game_name":  "Apex Legends",
        "view_count":  319,
        "created_at":  "2023-11-25T15:42:54Z",
        "duration":  "0:59",
        "thumbnail_url":  "https://static-cdn.jtvnw.net/twitch-video-assets/twitch-vap-video-assets-prod-us-west-2/c0dcb5ac-de11-4f76-afe6-e934da7986cc/landscape/thumb/thumb-0000000000-1664x936.jpg",
        "clip_slug":  "DelightfulEagerJaguarOptimizePrime-QbgtHgWTCqbUsS9a"
    },
    {
        "id":  "1790549127",
        "title":  "桜ビール",
        "game_name":  "ELDEN RING",
        "view_count":  292,
        "created_at":  "2022-02-25T11:38:57Z",
        "duration":  "0:08",
        "thumbnail_url":  "https://static-cdn.jtvnw.net/twitch-video-assets/twitch-vap-video-assets-prod-us-west-2/20402df1-b4a1-44dd-b969-76a1cb3c758f/landscape/thumb/thumb-0000000000-1664x936.jpg",
        "clip_slug":  "CalmBetterChinchillaVoHiYo-wpozRppPgM1r-E5u"
    },
    {
        "id":  "2822016279",
        "title":  "睡眠時無意識脂拭き症候群",
        "game_name":  "I\u0027m Only Sleeping",
        "view_count":  263,
        "created_at":  "2023-12-20T06:36:46Z",
        "duration":  "0:14",
        "thumbnail_url":  "https://static-cdn.jtvnw.net/twitch-video-assets/twitch-vap-video-assets-prod-us-west-2/3d6501a7-ab31-4655-b53a-63131d80953a/landscape/thumb/thumb-0000000000-1664x936.jpg",
        "clip_slug":  "DeterminedHungrySandpiperWow-ug3GAb8V_LG88uvy"
    },
    {
        "id":  "2198228613",
        "title":  "キルポチャンス♪",
        "game_name":  "Apex Legends",
        "view_count":  241,
        "created_at":  "2022-11-28T17:34:30Z",
        "duration":  "0:17",
        "thumbnail_url":  "https://static-cdn.jtvnw.net/twitch-video-assets/twitch-vap-video-assets-prod-us-west-2/9774800e-9ace-4a67-8ef1-42f5d0928bd3/landscape/thumb/thumb-0000000000-1280x720.jpg",
        "clip_slug":  "RenownedPopularMilkPicoMause-Q-GsAUle5BFkqOpn"
    },
    {
        "id":  "2586190331",
        "title":  "思わずポーズするけど、一度もウィングマンは使っていない",
        "game_name":  "Apex Legends",
        "view_count":  235,
        "created_at":  "2024-11-12T13:41:13Z",
        "duration":  "0:30",
        "thumbnail_url":  "https://static-cdn.jtvnw.net/twitch-video-assets/twitch-vap-video-assets-prod-us-west-2/f415be00-c6ec-4f79-ba44-32a7d7e0c055/landscape/thumb/thumb-0000000000-1664x936.jpg",
        "clip_slug":  "FrozenCrackyRadicchioBigBrother-wk6k3-BLRwj7Vyon"
    },
    {
        "id":  "1787014476",
        "title":  "同様のあまり、、、何してんのおまえ",
        "game_name":  "Just Chatting",
        "view_count":  213,
        "created_at":  "2023-12-04T01:42:12Z",
        "duration":  "0:27",
        "thumbnail_url":  "https://static-cdn.jtvnw.net/twitch-video-assets/twitch-vap-video-assets-prod-us-west-2/5ffef980-5644-408d-bfc1-2ee953ae341c/landscape/thumb/thumb-0000000000-1664x936.jpg",
        "clip_slug":  "CoySmoggyKoupreyDatBoi-XlVKNolt2WpjuYU8"
    },
    {
        "id":  "3279938925",
        "title":  "チャンピオン(5位)",
        "game_name":  "Apex Legends",
        "view_count":  206,
        "created_at":  "2024-11-14T10:50:25Z",
        "duration":  "0:37",
        "thumbnail_url":  "https://static-cdn.jtvnw.net/twitch-video-assets/twitch-vap-video-assets-prod-us-west-2/ba36f171-3abc-400f-a057-c128ae44993b/landscape/thumb/thumb-0000000000-1664x936.jpg",
        "clip_slug":  "IntelligentDirtySangFailFish-pq8OOYrUZZTtVZAN"
    },
    {
        "id":  "990030172",
        "title":  "マリオネット2022豪華バージョン",
        "game_name":  "Music",
        "view_count":  205,
        "created_at":  "2022-05-23T13:58:44Z",
        "duration":  "0:30",
        "thumbnail_url":  "https://static-cdn.jtvnw.net/twitch-video-assets/twitch-vap-video-assets-prod-us-west-2/4f444cdd-6ce2-40b1-b949-e610b544495c/landscape/thumb/thumb-0000000000-1664x936.jpg",
        "clip_slug":  "DrabSuspiciousSheepThisIsSparta-4IwILL00Z-x5ZPt0"
    },
    {
        "id":  "198976189",
        "title":  "スパイク解除されてるけど、ブランコして遊ぶよ～",
        "game_name":  "VALORANT",
        "view_count":  204,
        "created_at":  "2023-07-21T14:49:13Z",
        "duration":  "0:18",
        "thumbnail_url":  "https://static-cdn.jtvnw.net/twitch-video-assets/twitch-vap-video-assets-prod-us-west-2/d251dc7d-6376-4700-94e9-7a77a9559395/landscape/thumb/thumb-0000000000-1664x936.jpg",
        "clip_slug":  "AltruisticManlyNarwhalTF2John-hoR4U_91AIdVXxI7"
    },
    {
        "id":  "4180691994",
        "title":  "イクイクイクイクイクｗｗｗｗｗｗ",
        "game_name":  "Monster Hunter Wilds",
        "view_count":  202,
        "created_at":  "2025-09-30T15:19:43Z",
        "duration":  "1:00",
        "thumbnail_url":  "https://static-cdn.jtvnw.net/twitch-video-assets/twitch-vap-video-assets-prod-us-west-2/091b88ae-86f1-4546-b463-3c6448333595/landscape/thumb/thumb-0000000000-1664x936.jpg",
        "clip_slug":  "PolishedRoughLocustKreygasm-1IsV0N0KNXmJNln_"
    },
    {
        "id":  "1737948336",
        "title":  "死因：M67",
        "game_name":  "Escape from Tarkov",
        "view_count":  201,
        "created_at":  "2021-09-19T16:28:37Z",
        "duration":  "0:25",
        "thumbnail_url":  "https://static-cdn.jtvnw.net/twitch-video-assets/twitch-vap-video-assets-prod-us-west-2/9d69e0f5-dfb4-49f2-a3e2-175ac438f03c/landscape/thumb/thumb-0000000000-1664x936.jpg",
        "clip_slug":  "CogentRenownedCarrotPicoMause-7quk2nRq261cwJRm"
    },
    {
        "id":  "3608117706",
        "title":  "この死に方をしたのは恐らく全世界で彼だけです...",
        "game_name":  "Unknown",
        "view_count":  200,
        "created_at":  "2022-08-18T22:56:42Z",
        "duration":  "0:20",
        "thumbnail_url":  "https://static-cdn.jtvnw.net/twitch-video-assets/twitch-vap-video-assets-prod-us-west-2/f7ad41d9-cadd-42aa-a6ba-a21d3b38b30b/landscape/thumb/thumb-0000000000-1280x720.jpg",
        "clip_slug":  "AdventurousFilthyGoshawkFloof-yXefsqQi-tyvxOiS"
    },
    {
        "id":  "289927788",
        "title":  "決意のレプリケーター",
        "game_name":  "Apex Legends",
        "view_count":  187,
        "created_at":  "2024-03-24T15:41:23Z",
        "duration":  "0:58",
        "thumbnail_url":  "https://static-cdn.jtvnw.net/twitch-video-assets/twitch-vap-video-assets-prod-us-west-2/cfb960fe-9689-4536-a706-dbfac37be19d/landscape/thumb/thumb-0000000000-1664x936.jpg",
        "clip_slug":  "AgreeableArtsyLEDTebowing-4cTWeMYydulZi0Et"
    },
    {
        "id":  "3005552911",
        "title":  "駆け込み乗車はご遠慮ください",
        "game_name":  "Escape from Tarkov",
        "view_count":  175,
        "created_at":  "2024-10-07T14:39:23Z",
        "duration":  "1:00",
        "thumbnail_url":  "https://static-cdn.jtvnw.net/twitch-video-assets/twitch-vap-video-assets-prod-us-west-2/7f975ec3-f0b1-491c-8efc-9f556b0fcce0/landscape/thumb/thumb-0000000000-1664x936.jpg",
        "clip_slug":  "ArtsyEnticingPizzaFailFish-BbiwEMWYiXnNpCYZ"
    },
    {
        "id":  "2747190053",
        "title":  "超えられない壁が、そこにはありました",
        "game_name":  "Monster Hunter: World",
        "view_count":  175,
        "created_at":  "2024-01-14T02:21:47Z",
        "duration":  "0:32",
        "thumbnail_url":  "https://static-cdn.jtvnw.net/twitch-video-assets/twitch-vap-video-assets-prod-us-west-2/c5b46280-abcf-4620-bee8-a95ec3f542d3/landscape/thumb/thumb-0000000000-1664x936.jpg",
        "clip_slug":  "HandsomeShyKumquatPJSugar-rBB0Z2xqU8yYM6-6"
    },
    {
        "id":  "4152609831",
        "title":  "国語勉強しよう！",
        "game_name":  "Apex Legends",
        "view_count":  173,
        "created_at":  "2022-11-11T10:20:12Z",
        "duration":  "0:10",
        "thumbnail_url":  "https://static-cdn.jtvnw.net/twitch-video-assets/twitch-vap-video-assets-prod-us-west-2/6df63638-b36f-4907-90e3-1b900039d00f/landscape/thumb/thumb-0000000000-1280x720.jpg",
        "clip_slug":  "ArtisticVivaciousRingBIRB-q_eQp3cI3Y2soX5a"
    },
    {
        "id":  "3214087660",
        "title":  "ゴールド昇格の瞬間、感極まるかと思いきや顔の脂とるにゅーさん",
        "game_name":  "Apex Legends",
        "view_count":  166,
        "created_at":  "2023-11-19T17:36:11Z",
        "duration":  "0:59",
        "thumbnail_url":  "https://static-cdn.jtvnw.net/twitch-video-assets/twitch-vap-video-assets-prod-us-west-2/c413275e-0cc1-466a-af6a-0d3a33523aaa/landscape/thumb/thumb-0000000000-1664x936.jpg",
        "clip_slug":  "NeighborlyWealthyArmadilloNotATK-RcH0rn1IG_2IUJ3D"
    },
    {
        "id":  "3365745626",
        "title":  "これが上級者のプレイだ！",
        "game_name":  "Apex Legends",
        "view_count":  147,
        "created_at":  "2023-11-18T12:21:37Z",
        "duration":  "0:17",
        "thumbnail_url":  "https://static-cdn.jtvnw.net/twitch-video-assets/twitch-vap-video-assets-prod-us-west-2/dbf150d2-954c-4e60-8df3-0d8e6875836a/landscape/thumb/thumb-0000000000-1664x936.jpg",
        "clip_slug":  "RelievedRoundSpiderAliens-40yegU6FWRN6WYwv"
    },
    {
        "id":  "2623717765",
        "title":  "～完～",
        "game_name":  "Unknown",
        "view_count":  138,
        "created_at":  "2022-02-16T12:54:09Z",
        "duration":  "0:12",
        "thumbnail_url":  "https://static-cdn.jtvnw.net/twitch-video-assets/twitch-vap-video-assets-prod-us-west-2/1daa623f-d9e1-4080-851a-c69fd671dc1e/landscape/thumb/thumb-0000000000-1664x936.jpg",
        "clip_slug":  "TenderCrowdedWhaleMrDestructoid-Bv3c6N7XVBUY0Yl4"
    },
    {
        "id":  "175304008",
        "title":  "刮目せよ！ゲスの極みの瞬間",
        "game_name":  "Apex Legends",
        "view_count":  138,
        "created_at":  "2024-11-28T13:49:09Z",
        "duration":  "0:45",
        "thumbnail_url":  "https://static-cdn.jtvnw.net/twitch-video-assets/twitch-vap-video-assets-prod-us-west-2/affa7dac-f79b-48ac-830a-75e36af04d82/landscape/thumb/thumb-0000000000-1664x936.jpg",
        "clip_slug":  "ExpensiveBrightRadishYouWHY-4W3ufIVt0fBZhhTH"
    },
    {
        "id":  "2097184602",
        "title":  "きゅんきゅんびびびびびびびびびｂ",
        "game_name":  "Escape from Tarkov",
        "view_count":  133,
        "created_at":  "2021-08-25T14:25:43Z",
        "duration":  "0:28",
        "thumbnail_url":  "https://static-cdn.jtvnw.net/twitch-video-assets/twitch-vap-video-assets-prod-us-west-2/e9923e79-d66a-4304-9b90-b24484719360/landscape/thumb/thumb-0000000000-1664x936.jpg",
        "clip_slug":  "UnsightlyDeterminedVelociraptorUWot-4QUlBPDUHvosKnwE"
    },
    {
        "id":  "3523022036",
        "title":  "魚座　ぎょうざ",
        "game_name":  "Escape from Tarkov",
        "view_count":  133,
        "created_at":  "2023-08-28T10:38:15Z",
        "duration":  "0:11",
        "thumbnail_url":  "https://static-cdn.jtvnw.net/twitch-video-assets/twitch-vap-video-assets-prod-us-west-2/29b9eb6e-617f-47a5-adb8-ffde68df3412/landscape/thumb/thumb-0000000000-1664x936.jpg",
        "clip_slug":  "CautiousLongPoxCmonBruh-Nxdni4bO1iiK0S15"
    },
    {
        "id":  "1743997101",
        "title":  "不良品のヘムロックを持たされるnewsaam",
        "game_name":  "Apex Legends",
        "view_count":  129,
        "created_at":  "2024-11-12T12:38:24Z",
        "duration":  "0:21",
        "thumbnail_url":  "https://static-cdn.jtvnw.net/twitch-video-assets/twitch-vap-video-assets-prod-us-west-2/410af55e-632f-4a4e-975d-a925a38f762c/landscape/thumb/thumb-0000000000-1664x936.jpg",
        "clip_slug":  "GoldenLivelyHabaneroKappaRoss-MdNWYPSTBhAr1u7j"
    },
    {
        "id":  "2283824002",
        "title":  "きゅんきゅんビームを10ポイントにした結果....",
        "game_name":  "Escape from Tarkov",
        "view_count":  114,
        "created_at":  "2021-07-08T16:58:33Z",
        "duration":  "0:56",
        "thumbnail_url":  "https://static-cdn.jtvnw.net/twitch-video-assets/twitch-vap-video-assets-prod-us-west-2/bcaa3ac4-16dd-48c0-ab76-581d9f9cca79/landscape/thumb/thumb-0000000000-1664x936.jpg",
        "clip_slug":  "GentleLaconicPidgeonKappaClaus-_vTd8riT4z8A1npg"
    },
    {
        "id":  "1375715026",
        "title":  "うとぅんどぅがどうしても言えないぬーさん",
        "game_name":  "Apex Legends",
        "view_count":  114,
        "created_at":  "2024-01-19T16:00:34Z",
        "duration":  "0:40",
        "thumbnail_url":  "https://static-cdn.jtvnw.net/twitch-video-assets/twitch-vap-video-assets-prod-us-west-2/56ac5c18-4429-483b-81b2-ed42eb431736/landscape/thumb/thumb-0000000000-1664x936.jpg",
        "clip_slug":  "LivelyFreezingDolphinCeilingCat-L7OV42tR5qJ7IMwO"
    },
    {
        "id":  "1707091663",
        "title":  "「こんにちは、にゅーさんいますか？」",
        "game_name":  "Resident Evil 2",
        "view_count":  114,
        "created_at":  "2022-06-28T17:27:21Z",
        "duration":  "0:09",
        "thumbnail_url":  "https://static-cdn.jtvnw.net/twitch-video-assets/twitch-vap-video-assets-prod-us-west-2/9951b9e0-2d2a-4048-9070-48b86a83f51e/landscape/thumb/thumb-0000000000-1664x936.jpg",
        "clip_slug":  "HungryBetterBillRedCoat-uX4x0uD7r2QTRtqI"
    }
];

window.CLIPS_DATA = CLIPS_DATA;
