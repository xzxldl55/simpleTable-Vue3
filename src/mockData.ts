export type Sex = 0 | 1
export type SexStr = '男' | '女'
export type Staff = {
  name: string
  age: number
  sex: Sex
};

// const getRandomLetter = () => String.fromCharCode(Number(`0x${Math.floor(Math.random() * (122 - 97) + 97).toString(16)}`))
// 生成随机6位的字母
// const getRandomName = (): string => {
//   return new Array(6).fill(1).map((v, i) => i ? getRandomLetter() : getRandomLetter().toUpperCase()).join('')
// }

const mockTableData: Staff[] = new Array(499).fill(1).map((v, i) => ({
  name: `Jerry${i}`, // 这里为了便于测试totoMatchSnapshot不报错，就不使用Random生成的名字
  age: Math.min(100, i + 1),
  sex: i % 2 === 0 ? 0 : 1,
}))
mockTableData.push({
  name: '',
  age: 15,
  sex: 0,
})

const mockTableColumns = [
  {
    name: 'name',
    title: '姓名',
    canSort: true,
  },
  {
    name: 'age',
    title: '年龄',
    canSort: true,
  },
  {
    name: 'sex',
    title: '性别',
    renderFn: (val: Sex): SexStr => {
      return val ? '男' : '女'
    },
  },
]

export {
  mockTableData,
  mockTableColumns,
}
