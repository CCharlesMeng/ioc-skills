```json
{
    "contents": [
        {
            "type": "card",
            "title": "自有人员",
            "components": [
                {
                    "type": "text",
                    "value": "2,888人",
                    "text": "总人力: "
                },
                {
                    "type": "echarts",
                    "value": "98%",
                    "text": "配置率 "
                },
                {
                    "type": "text",
                    "value": "98.2%",
                    "text": "干部配置率: "
                },
                {
                    "type": "text",
                    "value": "95%",
                    "text": "本地化率: "
                },
                {
                    "type": "echarts",
                    "value": "95%",
                    "text": "重点岗位人力分布"
                }
            ],
            "layout": {
                "gridArea": {
                    "rowStart": 1,
                    "rowSpan": 2,
                    "colStart": 1,
                    "colSpan": 6
                }
            }
        },
        {
            "type": "card",
            "title": "穿透人力",
            "components": [
                {
                    "type": "text",
                    "value": "1,888人",
                    "text": "公有云穿透人力: "
                },
                {
                    "type": "echarts",
                    "value": "98%",
                    "text": "配置率 "
                },
                {
                    "type": "text",
                    "value": "1,000人",
                    "text": "混合云穿透人力: "
                },
                {
                    "type": "echarts",
                    "value": "98%",
                    "text": "配置率 "
                }
            ],
            "layout": {
                "gridArea": {
                    "rowStart": 1,
                    "rowSpan": 2,
                    "colStart": 7,
                    "colSpan": 4
                }
            }
        },
        {
            "type": "card",
            "title": "非雇员人力",
            "components": [
                {
                    "type": "text",
                    "value": "1,888人",
                    "text": "非雇员人力: "
                },
                {
                    "type": "echarts",
                    "value": "98%",
                    "text": "配置率 "
                }
            ],
            "layout": {
                "gridArea": {
                    "rowStart": 1,
                    "rowSpan": 2,
                    "colStart": 11,
                    "colSpan": 4
                }
            }
        },
        {
            "type": "card",
            "title": "人均效能",
            "components": [
                {
                    "type": "text",
                    "value": "1,288万",
                    "text": "人均收入(自有): "
                },
                {
                    "type": "text",
                    "value": "1,288万",
                    "text": "人均收入(含穿透): "
                },
                {
                    "type": "text",
                    "value": "14%",
                    "text": "人均效能 (E/R): "
                }
            ],
            "layout": {
                "gridArea": {
                    "rowStart": 1,
                    "rowSpan": 2,
                    "colStart": 15,
                    "colSpan": 4
                }
            }
        },
        {
            "type": "card",
            "title": "能力提升",
            "components": [
                {
                    "type": "text",
                    "value": "95%",
                    "text": "任职资格匹配率: "
                },
                {
                    "type": "text",
                    "value": "16H",
                    "text": "人均学习时长: "
                }
            ],
            "layout": {
                "gridArea": {
                    "rowStart": 1,
                    "rowSpan": 2,
                    "colStart": 19,
                    "colSpan": 6
                }
            }
        },
        {
            "type": "card",
            "title": "配置率趋势洞察",
            "components": [
                {
                    "type": "echarts",
                    "data": [
                        {"month": "1月", "rate": "81%"},
                        {"month": "2月", "rate": "70%"},
                        {"month": "3月", "rate": "79%"},
                        {"month": "4月", "rate": "46%"},
                        {"month": "5月", "rate": "75%"},
                        {"month": "6月", "rate": "52%"},
                        {"month": "7月", "rate": "81%"},
                        {"month": "8月", "rate": "70%"},
                        {"month": "9月", "rate": "79%"},
                        {"month": "10月", "rate": "46%"},
                        {"month": "11月", "rate": "52%"},
                        {"month": "12月", "rate": "79%"}
                    ]
                }
            ],
            "layout": {
                "gridArea": {
                    "rowStart": 3,
                    "rowSpan": 2,
                    "colStart": 1,
                    "colSpan": 8
                }
            }
        },
        {
            "type": "card",
            "title": "人均效能",
            "components": [
                {
                    "type": "table",
                    "columns": [
                        "分类",
                        "数量",
                        "收入($)",
                        "收入占比",
                        "人数",
                        "人数占比",
                        "人均收入"
                    ],
                    "data": [
                        {
                            "分类": "重点国/代",
                            "数量": 32,
                            "收入($)": 5400,
                            "收入占比": "73%",
                            "人数": 400,
                            "人数占比": "69%",
                            "人均收入": "688万"
                        },
                        {
                            "分类": "价值国/代",
                            "数量": 30,
                            "收入($)": 1700,
                            "收入占比": "23%",
                            "人数": 161,
                            "人数占比": "28%",
                            "人均收入": "1,288万"
                        },
                        {
                            "分类": "其他",
                            "数量": 57,
                            "收入($)": 300,
                            "收入占比": "4%",
                            "人数": 22,
                            "人数占比": "3%",
                            "人均收入": "1,088万"
                        }
                    ]
                }
            ],
            "layout": {
                "gridArea": {
                    "rowStart": 5,
                    "rowSpan": 2,
                    "colStart": 1,
                    "colSpan": 8
                }
            }
        },
        {
            "type": "card",
            "title": "地图",
            "components": [
                {
                    "type": "map",
                    "data": [
                        {"country": "XX国家", "value": "数据"},
                        {"country": "巴西", "value": "数据"}
                    ]
                }
            ],
            "layout": {
                "gridArea": {
                    "rowStart": 3,
                    "rowSpan": 4,
                    "colStart": 9,
                    "colSpan": 16
                }
            }
        }
    ]
}
``` 