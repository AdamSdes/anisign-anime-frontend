export const transformValue = (key: string, value: string): string => {
    const transformations: Record<string, Record<string, string>> = {
        kind: {
            tv: 'ТВ Сериал',
            tv_special: 'ТВ Спешл',
            movie: 'Фильм',
            ova: 'OVA',
            ona: 'ONA',
            special: 'Спешл',
            music: 'Клип'
        },
        status: {
            released: 'Вышел',
            ongoing: 'Онгоинг',
            announced: 'Анонсировано'
        },
        rating: {
            g: 'G',
            pg: 'PG',
            pg_13: 'PG-13',
            r: 'R-17',
            r_plus: 'R+',
            rx: 'Rx'
        }
    }

    if (key === 'season' && value) {
        const [season, year] = value.split('_')
        const seasons: Record<string, string> = {
            winter: 'Зима',
            spring: 'Весна',
            summer: 'Лето',
            fall: 'Осень'
        }
        return `${seasons[season]} ${year}`
    }

    if (key in transformations && value in transformations[key]) {
        return transformations[key][value]
    }
    
    return value
}

export const transformDescription = (description: string): string => {
    if (!description) return ''
    
    // Remove character markup for now
    return description.replace(/\[character=\d+\]([^\[]+)\[\/character\]/g, '$1')
}
