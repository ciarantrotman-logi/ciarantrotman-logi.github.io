function generate_blended_data(performance_data, cached_uid){
    let blended_performance_data = [];
    performance_data.forEach(data => {
        blended_performance_data.push({
            'uid': cached_uid,
            'dpr': dpr,
            'fps': sessionStorage.getItem('fps'),
            'polling-rate': sessionStorage.getItem('polling-rate'),
            
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
function pearsons_r(target_case, effective_flag){
    let filtered_array = all_performance_data
        .filter(struct => struct.task_type === target_case)
        .map(struct => ({
            index_of_difficulty : effective_flag
                ? struct.effective_index_of_difficulty
                : struct.index_of_difficulty,
            movement_time : struct.movement_time_ms
        }));
    const n = filtered_array.length;

    let x_values = filtered_array.map(struct => struct.index_of_difficulty);
    let y_values = filtered_array.map(struct => struct.movement_time);

    const mean_x = x_values.reduce((a, b) => a + b, 0) / n;
    const mean_y = y_values.reduce((a, b) => a + b, 0) / n;

    const difference_x = x_values.map(x => x - mean_x);
    const difference_y = y_values.map(y => y - mean_y);

    const sum_of_product_of_difference = difference_x.reduce((a, b, i) => a + b * difference_y[i], 0);

    const sum_of_square_of_difference_x = difference_x.reduce((a, b) => a + b * b, 0);
    const sum_of_square_of_difference_y = difference_y.reduce((a, b) => a + b * b, 0);

    return sum_of_product_of_difference / Math.sqrt(sum_of_square_of_difference_x * sum_of_square_of_difference_y);
}
function fisher_transformation(r) {
    return 0.5 * Math.log((1 + r) / (1 - r));
}
function abramowitz_and_stegun_approximation(z) {
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989423 * Math.exp((-z * z) / 2);
    const approximated_CDF = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return 2 * (1 - approximated_CDF);
}
