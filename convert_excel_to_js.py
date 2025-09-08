import pandas as pd
import json
import os
import pandas as pd

# 设置文件路径
excel_file_path = os.path.join('honorHomeData', 'XDOG_first_donation.xlsx')
output_js_file = 'donation_contributors_data.js'

# 读取Excel文件
try:
    # 读取Excel文件的第一个工作表
    df = pd.read_excel(excel_file_path)
    
    # 检查数据是否为空
    if df.empty:
        print("Excel文件为空")
        exit(1)
    
    print(f"成功读取Excel文件，包含{len(df)}行数据")
    
    # 初始化贡献者列表
    contributors = []
    
    # 遍历数据行，直到id为空行
    for index, row in df.iterrows():
        # 假设第一列是序号，第二列是人物id，第三列是捐赠XDOG枚数
        # 根据Excel文件的实际结构调整列索引或列名
        try:
            # 尝试获取序号（第一列）
            rank = int(row.iloc[0]) if pd.notna(row.iloc[0]) else index + 1
            
            # 尝试获取人物id（第二列）
            username = str(row.iloc[1]) if pd.notna(row.iloc[1]) else ''
            
            # 尝试获取捐赠XDOG枚数（第三列）
            donation = float(row.iloc[2]) if pd.notna(row.iloc[2]) else 0
            
            # 如果id为空，则停止处理
            if not username or username.lower() == 'nan':
                print(f"遇到空id行，停止处理。已处理{index}行数据")
                break
            
            # 添加到贡献者列表
            contributors.append({
                'rank': rank,
                'username': username,
                'donation': donation,
                # 添加一些默认值以便与现有代码兼容
                'icon': 'user',
                'areas': {
                    'en': 'Donor',
                    'zh': '捐赠者'
                }
            })
        except Exception as e:
            print(f"处理第{index+1}行时出错: {e}")
            continue
    
    print(f"成功处理{len(contributors)}条贡献者数据")
    
    # 创建JavaScript文件内容
    js_content = f"""// XDOG首次捐赠贡献者数据
const donationContributorsData = {json.dumps(contributors, ensure_ascii=False, indent=2)};
"""
    
    # 写入JavaScript文件
    with open(output_js_file, 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"成功创建JavaScript数据文件: {output_js_file}")
    print(f"数据格式示例: {json.dumps(contributors[:3], ensure_ascii=False, indent=2)}")
    
except Exception as e:
    print(f"读取Excel文件时出错: {e}")
    exit(1)