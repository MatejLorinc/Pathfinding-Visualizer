import styled from "styled-components";
import {FC, useState} from "react";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {Neighbor, NeighborColumn, neighborItems, NeighborOrder} from "../../../utils/settings";
import draggableIcon from "/assets/draggableIcon.svg";

export type Direction = "top" | "left" | "right" | "bottom" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight"

const Container = styled.div`
  margin: 1em 0;
`;

const NeighborContainer = styled.div`
  display: flex;
`;

const NeighborTitle = styled.h2`
  padding: 8px;
  text-align: center;
`;


export const Neighbors: FC<{ neighborOrder: NeighborOrder }> = ({neighborOrder}) => {
    const [columns, setColumns] = useState(neighborOrder);

    const updateColumns = (newColumns: NeighborOrder) => {
        neighborOrder.enabledColumn = newColumns.enabledColumn;
        neighborOrder.disabledColumn = newColumns.disabledColumn;
        setColumns(newColumns);
    };

    return (
        <Container>
            <NeighborTitle>Neighbor visit order</NeighborTitle>
            <DragDropContext
                onDragEnd={(result) => {
                    const {destination, source, draggableId} = result;

                    if (!destination) {
                        return;
                    }

                    if (destination.droppableId === source.droppableId && destination.index === source.index) {
                        return;
                    }

                    const fromColumn = columns[source.droppableId];
                    const toColumn = columns[destination.droppableId];

                    if (fromColumn === toColumn) {
                        const newItemIds = Array.from(fromColumn.itemIds);
                        newItemIds.splice(source.index, 1);
                        newItemIds.splice(destination.index, 0, draggableId);

                        const newColumn = {
                            ...fromColumn,
                            itemIds: newItemIds,
                        };

                        const newColumns = {
                            ...columns,
                            [newColumn.id]: newColumn,
                        };

                        updateColumns(newColumns);
                    } else {
                        const fromColumnItemIds = Array.from(fromColumn.itemIds);
                        fromColumnItemIds.splice(source.index, 1);
                        const newFromColumn = {
                            ...fromColumn,
                            itemIds: fromColumnItemIds,
                        };

                        const toColumnItemIds = Array.from(toColumn.itemIds);
                        toColumnItemIds.splice(destination.index, 0, draggableId);
                        const newFinish = {
                            ...toColumn,
                            itemIds: toColumnItemIds,
                        };

                        const newColumns = {
                            ...columns,
                            [newFromColumn.id]: newFromColumn,
                            [newFinish.id]: newFinish,
                        };

                        updateColumns(newColumns);
                    }
                }}
            >
                <NeighborContainer>
                    {Object.values(columns).map((column: NeighborColumn) => {
                        const items = column.itemIds.map((itemId: string) => neighborItems[itemId]);

                        return <Column key={column.id} column={column} items={items}/>;
                    })}
                </NeighborContainer>
            </DragDropContext>
        </Container>
    );
};

const ColumnContainer = styled.div`
  margin: 8px;
  width: 190px;

  display: flex;
  flex-direction: column;
`;

const ColumnTitle = styled.h3`
  padding: 8px;
  text-align: center;
  font-weight: normal;
`;

const ItemList = styled.div`
  padding: 8px;
  flex-grow: 1;
  min-height: 50px;
`;

const Column: FC<{ column: NeighborColumn, items: Neighbor[] }> = (props) => {
    return (
        <ColumnContainer>
            <ColumnTitle>{props.column.title}</ColumnTitle>

            <Droppable droppableId={props.column.id}>
                {(provided) => (
                    <ItemList ref={provided.innerRef} {...provided.droppableProps} style={{flexGrow: 1}}>
                        {props.items.map((item, index) => (
                            <Item key={item.id} item={item} index={index}/>
                        ))}
                        {provided.placeholder}
                    </ItemList>
                )}
            </Droppable>
        </ColumnContainer>
    );
};

const ItemContainer = styled.div<{ isDragging: boolean }>`
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 8px;
  transition-property: background-color, box-shadow;
  transition-duration: 200ms;
  box-shadow: ${({isDragging}) =>
          isDragging
                  ? " 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.2)"
                  : "0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12)"};
  background-color: ${({isDragging}) => (isDragging ? "#484848" : "#3e3e3e")};
`;

interface ItemProps {
    item: Neighbor;
    index: number;
}

const Item: FC<ItemProps> = (props) => {
    return (
        <Draggable draggableId={props.item.id} index={props.index}>
            {(provided, snapshot) => (
                <ItemContainer {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}
                               isDragging={snapshot.isDragging}>
                    <NeighborCard iconDest={props.item.iconDest} label={props.item.name}></NeighborCard>
                </ItemContainer>
            )}
        </Draggable>
    );
};

const Icon = styled.span<{ imageDestination: string }>`
  margin: 0 5px 0 5px;
  padding: 7px;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(${({imageDestination}) => imageDestination});
`;

const Arrow = styled(Icon)`
  float: left;
`;

const DraggableIcon = styled(Icon)`
  float: right;
`;

const DirectionLabel = styled.span`
  margin: 0 10px 0 10px;
  font-size: 1.15em;
`;

interface CardProps {
    iconDest: string,
    label: string
}


export const NeighborCard: FC<CardProps> = ({iconDest, label}) => {
    return (<div>
        <Arrow imageDestination={iconDest}></Arrow>
        <DraggableIcon imageDestination={draggableIcon}></DraggableIcon>
        <DirectionLabel>{label}</DirectionLabel>
    </div>);
};
