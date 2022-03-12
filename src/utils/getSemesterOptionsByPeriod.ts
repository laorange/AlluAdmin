export interface SemesterOption {
    value: number,
    label: string,
}

export function getSemesterOptionsByPeriod(periodGiven: number): SemesterOption[] {
    let _gradeSelectOptions: SemesterOption[]

    if (periodGiven % 2) {
        _gradeSelectOptions = [
            {
                value: 1,
                label: "大一上",
            },
            {
                value: 3,
                label: "大二上",
            },
            {
                value: 5,
                label: "大三上",
            },
            {
                value: 7,
                label: "大四上",
            },
            {
                value: 9,
                label: "研一上",
            },
            {
                value: 11,
                label: "研二上",
            },
        ];
    } else {
        _gradeSelectOptions = [
            {
                value: 2,
                label: "大一下",
            },
            {
                value: 4,
                label: "大二下",
            },
            {
                value: 6,
                label: "大三下",
            },
            {
                value: 8,
                label: "大四下",
            },
            {
                value: 10,
                label: "研一下",
            },
            {
                value: 12,
                label: "研二下",
            },
        ]
    }

    _gradeSelectOptions.push({
        value: 0,
        label: '不限年级'
    })
    return _gradeSelectOptions
}