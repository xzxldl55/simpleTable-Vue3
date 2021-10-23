import { defineComponent, computed } from '@vue/composition-api';
import { columnProps, ColumnPublicProps } from './types';

export default defineComponent({
    name: 'TableColumn',
    props: columnProps,
    setup (props, { slots, emit }) {
        const title = props.title
        const name = props.name
        const canSort = props.canSort
        const classes = useClass(props)
        
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

const useClass = (props: ColumnPublicProps) => {
    return computed(() => {
        return {
            'column-sort': true,
            'des': props.sortConf?.sortKey === props.name && !props.sortConf?.sort,
            'asc': props.sortConf?.sortKey === props.name && props.sortConf?.sort,
        }
    })
}