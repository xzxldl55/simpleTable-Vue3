import { defineComponent } from '@vue/composition-api';
import { columnProps } from './types';

export default defineComponent({
    name: 'TableColumn',
    props: columnProps,
    setup (props, { slots, emit }) {
        const title = props.title
        const name = props.name
        const canSort = props.canSort
        const emitSort = () => {
            emit('click', name);
        }
        return () => {
            return (
                <th column-name={name}>
                    { title }
                    {
                        canSort ?
                        <span class="column-sort"
                              onClick={emitSort}></span> :
                        ''
                    }
                </th>
            )
        }
    }
})