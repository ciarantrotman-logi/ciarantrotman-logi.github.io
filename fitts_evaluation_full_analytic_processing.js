function generate_csv_data(all_performance_data){
    let csv = [];
    csv.push({
        'amplitude': 'amplitude',
        'effective_amplitude': 'effective_amplitude',
        'width': 'width',
        'effective_width': 'effective_width',
        'index_of_difficulty': 'index_of_difficulty',
        'effective_index_of_difficulty': 'effective_index_of_difficulty',
        'throughput': 'throughput',
        'effective_throughput': 'effective_throughput',
        'movement_time_ms': 'movement_time_ms',
        'target_position_x': 'target_position_x',
        'target_position_y': 'target_position_y',
        'global_cursor_position_x': 'global_cursor_position_x',
        'global_cursor_position_y': 'global_cursor_position_y',
        'local_cursor_position_x': 'local_cursor_position_x',
        'local_cursor_position_y': 'local_cursor_position_y',
        'relative_cursor_position_x': 'relative_cursor_position_x',
        'relative_cursor_position_y': 'relative_cursor_position_y',
        'approach_vector_x': 'approach_vector_x',
        'approach_vector_y': 'approach_vector_y',
        'perpendicular_vector_x': 'perpendicular_vector_x',
        'perpendicular_vector_y': 'perpendicular_vector_y',
        'section_index': 'section_index',
        'action_index': 'action_index',
        'task_type': 'task_type',

        'benchmark-flag': 'benchmark-flag',

        'user-name': 'user-name',
        'user-hand-size': 'user-hand-size',
        'user-mouse-usage': 'user-mouse-usage',
        'user-technical-familiarity': 'user-technical-familiarity',

        'evaluation-mouse-make': 'evaluation-mouse-make',
        'evaluation-mouse-model': 'evaluation-mouse-model',
        'evaluation-mouse-dpi': 'evaluation-mouse-dpi',
        'evaluation-mouse-dpi*': 'evaluation-mouse-dpi*',
        'evaluation-mouse-acceleration': 'evaluation-mouse-acceleration',

        'evaluation-surface': 'evaluation-surface',
        'evaluation-mat-make': 'evaluation-mat-make',
        'evaluation-mat-model': 'evaluation-mat-model',
        'evaluation-mat-hardness': 'evaluation-mat-hardness',
        'evaluation-mat-roughness': 'evaluation-mat-roughness',
        'evaluation-desk-material': 'evaluation-mat-material',
        'evaluation-mouse-feet': 'evaluation-mouse-feet',
        'evaluation-mouse-feet-make': 'evaluation-mouse-feet-make',
        'evaluation-mouse-feet-model': 'evaluation-mouse-feet-model'
    });
    all_performance_data.forEach(data => {
        csv.push({
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
    return csv;
}