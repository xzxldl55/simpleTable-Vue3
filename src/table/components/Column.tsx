import { defineComponent, computed } from '@vue/composition-api';
import { columnProps, TSortState } from '../../types';

export default defineComponent({
    name: 'TableColumn',
    props: columnProps,
    setup (props, { emit }) {
        const title = props.title
        const name = props.name as string
        const canSort = props.canSort
        const classes = useClass(props.sortState, name)
        
        const emitSort = () => {
            emit('click', name);
        }
        return () => {
            return (
                <th column-name={name}>
                    { title }
                    {
                        canSort ?
                        // 区分一下上下高亮
                        <span class={classes.value}
                              onClick={emitSort}></span> :
                        ''
                    }
                </th>
            )
        }
    }
})

const useClass = (sortState: TSortState, name: string) => {
    return computed(() => {
        return {
            'column-sort': true,
            'des': sortState.name === name && !sortState.direction,
            'asc': sortState.name === name && sortState.direction,
        }
    })
}