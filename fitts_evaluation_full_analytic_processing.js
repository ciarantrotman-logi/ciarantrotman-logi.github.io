function generate_blended_data(performance_data, cached_uid){
    let blended_performance_data = [];
    performance_data.forEach(data => {
        blended_performance_data.push({
            'uid': cached_uid,
            'dpr': dpr,
            
            'amplitude': data.amplitude,
            'effective_amplitude': data.effective_amplitude,
            'width': data.width,
            'effective_width': data.effective_width,
            'index_of_difficulty': data.index_of_difficulty,
            'effective_index_of_difficulty': data.effective_index_of_difficulty,
            'throughput': data.throughput,
            'effective_throughput': data.effective_throughput,
            'movement_time_ms': data.movement_time_ms,
            'target_position_x': data.target.x,
            'target_position_y': data.target.y,
            'global_cursor_position_x': data.global_cursor_position.x,
            'global_cursor_position_y': data.global_cursor_position.y,
            'local_cursor_position_x': data.local_cursor_position.x,
            'local_cursor_position_y': data.local_cursor_position.y,
            'relative_cursor_position_x': data.relative_cursor_position.x,
            'relative_cursor_position_y': data.relative_cursor_position.y,
            'approach_vector_x' : data.approach_vector.x,
            'approach_vector_y' : data.approach_vector.y,
            'perpendicular_vector_x': data.perpendicular_vector.x,
            'perpendicular_vector_y': data.perpendicular_vector.y,
            'selection_index' : data.section_index,
            'action_index' : data.action_index,
            'task_type' : data.task_type,

            'benchmark-flag': sessionStorage.getItem('benchmark-flag'),

            'user_name': sessionStorage.getItem('user-name'),
            'user_hand_size': sessionStorage.getItem('user-hand-size'),
            'user_handedness': sessionStorage.getItem('user-handedness'),
            'user_mouse_usage': sessionStorage.getItem('user-mouse-usage'),
            'user_technical_familiarity': sessionStorage.getItem('user-technical-familiarity'),

            'evaluation-mouse-make': sessionStorage.getItem('evaluation-mouse-make'),
            'evaluation-mouse-model': sessionStorage.getItem('evaluation-mouse-model'),
            'evaluation-mouse-dpi': sessionStorage.getItem('evaluation-mouse-dpi'),
            'evaluation-mouse-dpi*': sessionStorage.getItem('evaluation-mouse-dpi*'),
            'evaluation-mouse-acceleration': sessionStorage.getItem('evaluation-mouse-acceleration'),

            'evaluation-surface': sessionStorage.getItem('evaluation-surface'),
            'evaluation-mat-make': sessionStorage.getItem('evaluation-mat-make'),
            'evaluation-mat-model': sessionStorage.getItem('evaluation-mat-model'),
            'evaluation-mat-hardness': sessionStorage.getItem('evaluation-mat-hardness'),
            'evaluation-mat-roughness': sessionStorage.getItem('evaluation-mat-roughness'),
            'evaluation-desk-material': sessionStorage.getItem('evaluation-mat-material'),
            'evaluation-mouse-feet': sessionStorage.getItem('evaluation-mouse-feet'),
            'evaluation-mouse-feet-make': sessionStorage.getItem('evaluation-mouse-feet-make'),
            'evaluation-mouse-feet-model': sessionStorage.getItem('evaluation-mouse-feet-model')
        })
    });
    return blended_performance_data;
}