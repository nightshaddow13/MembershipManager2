import { IReturn, IdResponse } from "@/dtos"
import { useClient } from "@/gateway"
import { sanitizeForUi } from "@/utils"
import { useState, useEffect, FormEvent, ChangeEvent, JSX } from "react"
import { ApiContext } from "@/components/Form"
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { ConfirmDelete, ErrorSummary, SelectInput, TextInput } from "@/components/Form"
import { Button } from "@/components/ui/button"
import SrcPage from "@/components/SrcPage.tsx"
import { useAuth } from "@/useAuth"
import { EditSidebarOptions, InputType } from "@/types"


type Props = {
    options: EditSidebarOptions,
    id?: number
    onDone: () => void
    onSave: () => void
}

function editSidebar<TEdit>({options, id, onDone, onSave }: Props): JSX.Element {
    
    const client = useClient()
    const { loading } = client
    const { hasRole } = useAuth()

    const [editUnit, setEditUnit] = useState<TEdit | null>(null)
    const [request, setRequest] = useState(options.createInstance)

    useEffect(() => {
        (async () => {
            if (id) {
                const api = await client.api(options.query({id}))
                const dto = api.response ? api.response.results[0] : null
                setEditUnit(dto)
                if (dto) setRequest(options.update(sanitizeForUi({... dto})))
            } else {
                setEditUnit(null)
            }
        })()
    }, [id]);

    async function onSubmit(e:FormEvent<HTMLFormElement>) {
        e.preventDefault()
        await save()
    }
    async function save() {
        const api = await client.api(request)
        if (api.succeeded) (onSave ?? onDone)()
    }
    async function onDelete() {
        const api = await client.apiVoid(options.delete({id}))
        if (api.succeeded) (onSave ?? onDone)()
    }
    function change(f: (dto: IReturn<IdResponse>, value: string) => void) {
        return (e: ChangeEvent<HTMLInputElement>) => {
            f(request, e.target.value)
            setRequest(options.update(request))
        }
    }

    return (<ApiContext.Provider value={client}>
        <Sheet open={editUnit != null} onOpenChange={onDone}>
            <SheetContent className="w-screen xl:max-w-3xl md:max-w-xl max-w-lg">
                <SheetHeader>
                    <SheetTitle>Edit {options.typeName}</SheetTitle>
                </SheetHeader>
                {!editUnit ? null :
                    <form className="grid gap-4 py-4" onSubmit={onSubmit}>
                        <input className="hidden" type="submit"/>
                        <fieldset disabled={loading}>
                            <ErrorSummary except={options.visibleFields} className="mb-4"/>
                            <div className="grid grid-cols-6 gap-6">
                                {options.inputs.map((input) => (
                                    <div className="col-span-6 sm:col-span-3">
                                    {(() => {
                                        switch (input.type) {
                                            case InputType.NumberInput:
                                                return (
                                                    <TextInput id={input.id} 
                                                            type="number"  
                                                            min={input.min} 
                                                            required={input.required}
                                                            defaultValue={input.value}
                                                            onChange={change(input.onChange)} />
                                                )
                                            case InputType.Select:
                                                return (
                                                    <SelectInput id={input.id} 
                                                            options={input.options} 
                                                            value={input.value(request)} 
                                                            onChange={change(input.onChange)} />
                                                )
                                        }
                                    })()}
                                </div>
                            ))}
                            </div>
                        </fieldset>
                        <div className="flex justify-center">
                            <SrcPage path="bookings-crud/Edit.tsx" />
                        </div>
                    </form>}
                <SheetFooter>
                    <div
                        className="w-full absolute bottom-0 left-0 border-gray-200 dark:border-gray-700 border-t mt-4 px-4 py-3 bg-gray-50 dark:bg-gray-900 sm:px-6 flex flex-wrap justify-between">
                        <div>
                            {!hasRole('MembershipChair') ? null :
                                <ConfirmDelete onDelete={onDelete}>Delete</ConfirmDelete>}
                        </div>
                        <div></div>
                        <div className="flex justify-end">
                            <Button variant="outline" onClick={onDone}>Cancel</Button>
                            <Button type="submit" className="ml-4" disabled={loading} onClick={save}>Save</Button>
                        </div>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    </ApiContext.Provider>)
}

export default editSidebar