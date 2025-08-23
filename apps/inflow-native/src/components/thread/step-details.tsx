import { View, Text, Image } from 'react-native';
import { SearchStep, useOrchestrationStore } from '../../store/thread-store';

export function StepDetails() {
    const { steps } = useOrchestrationStore();
    return (
        <View className='flex-1'>
            {steps.map((step, idx) => {
                if (step.type == 'search') {
                    return <SearchStepSection key={idx} step={step}/>
                }
            })}
        </View>
    )
}

function SearchStepSection({
    step
}: {step: SearchStep}) {
    return (
        <View className='flex gap-2 '>
            <Text>搜索</Text>
            <View className='flex-row gap-2 flex-wrap'>
                <View className='p-2 pl-4 pr-4 rounded-lg' style={{backgroundColor: '#ece6e7'}}>
                    <Text>🔍 {step.query}</Text>
                </View>
            </View>

            <Text>查阅</Text>
            <View className='flex-row gap-2 flex-wrap'>
                {step.sources.map((source) => (
                    <View 
                        key={source.url}
                        className='flex-row p-2 rounded-lg items-center gap-1' 
                        style={{backgroundColor: '#ece6e7'}}
                    >   
                        <Image source={{uri: source.icon}} style={{ width: 12, height: 12 }}/>
                        <Text >{source.domain}</Text>
                    </View>
                ))}
            </View>

        </View>
    )
}