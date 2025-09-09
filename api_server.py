#!/usr/bin/env python3
import http.server
import socketserver
import json
import os
from urllib.parse import urlparse

# 设置服务器端口
PORT = 3000

# 读取贡献者数据
def load_donation_data():
    try:
        with open('donation_contributors_data.js', 'r', encoding='utf-8') as f:
            content = f.read()
            
            # 提取数组内容（从const声明后开始，直到最后的分号）
            import re
            # 更健壮的正则表达式来提取数组内容
            match = re.search(r'const\s+donationContributorsData\s*=\s*(\[.*?\]);', content, re.DOTALL)
            if match:
                # 获取匹配的数组部分
                array_content = match.group(1)
                # 使用json.loads解析
                try:
                    return json.loads(array_content)
                except json.JSONDecodeError as je:
                    print(f"JSON解析错误: {je}")
                    # 如果解析失败，尝试修复格式问题
                    # 移除多余的空白
                    array_content = array_content.strip()
                    # 确保所有字符串都用双引号包裹
                    # 处理可能的格式问题
                    import ast
                    # 使用ast.literal_eval作为最后的备选方案（更宽松的解析）
                    try:
                        # 但ast.literal_eval不支持带小数点的数字，所以先处理
                        # 将浮点数转换为整数（如果适用）
                        fixed_content = re.sub(r'(\d+)\.0', r'\1', array_content)
                        return ast.literal_eval(fixed_content)
                    except Exception as ae:
                        print(f"AST解析错误: {ae}")
                        raise Exception(f"无法解析捐赠数据: {je}")
            else:
                raise Exception("未找到有效的数据数组")
    except Exception as e:
        print(f"加载捐赠数据失败: {e}")
        # 返回默认的捐赠数据作为备用
        return [
            {"rank": 1, "username": " 布仔", "donation": 100000, "icon": "user", "areas": {"en": "Donor", "zh": "捐赠者"}},
            {"rank": 2, "username": "不二和尚9999.btc", "donation": 100000, "icon": "user", "areas": {"en": "Donor", "zh": "捐赠者"}},
            {"rank": 3, "username": "碳黑丶OKX ", "donation": 100000, "icon": "user", "areas": {"en": "Donor", "zh": "捐赠者"}}
        ]

# 读取事件数据
def load_event_data():
    try:
        with open('event_contributors_data.js', 'r', encoding='utf-8') as f:
            content = f.read()
            
            # 使用更稳健的方法提取数据结构
            import re
            # 匹配const eventContributorsData = 后面的整个对象，直到最后的};
            match = re.search(r'const\s+eventContributorsData\s*=\s*(.*?)};', content, re.DOTALL)
            if match:
                # 获取整个对象内容（包括最后的}）
                json_str = match.group(1) + '}'
                # 确保JSON格式正确（移除可能的注释）
                json_str = re.sub(r'//.*?\n|/\*.*?\*/', '', json_str, flags=re.DOTALL)
                # 清理JSON字符串，移除多余的空白字符
                json_str = json_str.strip()
                # 使用json.loads解析，提供更好的错误处理
                try:
                    return json.loads(json_str)
                except json.JSONDecodeError as je:
                    print(f"JSON解析错误: {je}")
                    # 如果解析失败，记录错误并返回默认数据
                    return {
                        "event1": {
                            "title": {"en": "Project Inception", "zh": "项目启动"},
                            "date": "March 15, 2023",
                            "contributors": [
                                {"username": "@crypto_visionary", "xp": 3200, "role": {"en": "Founder", "zh": "创始人"}},
                                {"username": "@tech_wizard", "xp": 3000, "role": {"en": "Lead Developer", "zh": "首席开发者"}}
                            ]
                        }
                    }
            else:
                raise Exception("未找到有效的数据对象")
    except Exception as e:
        print(f"加载事件数据失败: {e}")
        # 返回默认的事件数据作为备用
        return {
            "event1": {
                "title": {"en": "Project Inception", "zh": "项目启动"},
                "date": "March 15, 2023",
                "contributors": [
                    {"username": "@crypto_visionary", "xp": 3200, "role": {"en": "Founder", "zh": "创始人"}},
                    {"username": "@tech_wizard", "xp": 3000, "role": {"en": "Lead Developer", "zh": "首席开发者"}}
                ]
            }
        }

# 自定义请求处理器
class APIServerHandler(http.server.BaseHTTPRequestHandler):
    # 设置响应头
    def _set_headers(self, content_type='application/json'):
        self.send_response(200)
        self.send_header('Content-type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    # 处理OPTIONS请求
    def do_OPTIONS(self):
        self._set_headers()
    
    # 处理GET请求
    def do_GET(self):
        parsed_path = urlparse(self.path)
        
        # 处理捐赠数据API
        if parsed_path.path == '/api/donations':
            self._set_headers()
            donations = load_donation_data()
            self.wfile.write(json.dumps(donations).encode('utf-8'))
        
        # 处理事件数据API
        elif parsed_path.path == '/api/events':
            self._set_headers()
            events = load_event_data()
            self.wfile.write(json.dumps(events).encode('utf-8'))
        
        # 提供静态文件
        else:
            # 默认提供index.html
            if parsed_path.path == '/':
                file_path = 'index.html'
            else:
                file_path = parsed_path.path[1:]  # 移除开头的斜杠
            
            # 检查文件是否存在
            if os.path.exists(file_path) and os.path.isfile(file_path):
                # 设置适当的Content-Type
                if file_path.endswith('.html'):
                    content_type = 'text/html'
                elif file_path.endswith('.css'):
                    content_type = 'text/css'
                elif file_path.endswith('.js'):
                    content_type = 'application/javascript'
                elif file_path.endswith('.json'):
                    content_type = 'application/json'
                elif file_path.endswith('.jpg') or file_path.endswith('.jpeg'):
                    content_type = 'image/jpeg'
                elif file_path.endswith('.png'):
                    content_type = 'image/png'
                elif file_path.endswith('.gif'):
                    content_type = 'image/gif'
                elif file_path.endswith('.svg'):
                    content_type = 'image/svg+xml'
                else:
                    content_type = 'application/octet-stream'
                
                self.send_response(200)
                self.send_header('Content-type', content_type)
                self.end_headers()
                
                try:
                    with open(file_path, 'rb') as file:
                        self.wfile.write(file.read())
                except Exception as e:
                    # 处理Unicode编码问题，使用英文错误消息
                    self.send_error(500, "Server error occurred")
            else:
                # 处理Unicode编码问题，使用英文错误消息
                self.send_error(404, "File not found")

# 创建并启动服务器
def run_server():
    with socketserver.TCPServer(('', PORT), APIServerHandler) as httpd:
        print(f"API服务器启动在 http://localhost:{PORT}")
        print(f"捐赠数据API: http://localhost:{PORT}/api/donations")
        print(f"事件数据API: http://localhost:{PORT}/api/events")
        print("按Ctrl+C停止服务器")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n服务器已停止")

if __name__ == '__main__':
    run_server()