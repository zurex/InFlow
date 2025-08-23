const suggestedActions = [
    {
      title: '为什么',
      label: '英伟达增长的如此迅速?',
      action: '为什么英伟达增长的如此迅速?',
    },
    {
      title: '帮我写一段代码',
      label: `来演示djikstra's算法`,
      action: `帮我写一段代码来演示djikstra's算法`,
    },
    {
      title: '查询一下上海地区的天气',
      label: ``,
      action: `查询一下上海地区的天气`,
    },
]

export async function GET(req: Request) {
    return Response.json(suggestedActions);
}